import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, mkdir, rmdir } from "fs/promises";
import { join } from "path";
import { ExecutionResult, TestCase } from "../types";
import { randomUUID } from "crypto";
import { cwd } from "process";

const execAsync = promisify(exec);

export abstract class BaseExecutor {
  protected abstract readonly fileExtension: string;
  protected abstract readonly compileCommand?: string;
  protected abstract readonly runCommand: string;
  protected abstract readonly dockerImage: string;
  protected abstract readonly mainFileName?: string;
  protected readonly shell: string = "bash";
  protected tempExecutionDir: string = "/";

  private async checkDockerAvailability(): Promise<boolean> {
    try {
      await execAsync("docker ps");
      return true;
    } catch (error) {
      console.error("Docker is not available:", error);
      return false;
    }
  }

  private async ensureDockerImage(): Promise<boolean> {
    try {
      await execAsync(`docker image inspect ${this.dockerImage}`);
      return true;
    } catch (error) {
      try {
        console.log(`Pulling Docker image: ${this.dockerImage}`);
        await execAsync(`docker pull ${this.dockerImage}`);
        return true;
      } catch (pullError) {
        console.error(
          `Failed to pull Docker image ${this.dockerImage}:`,
          pullError,
        );
        return false;
      }
    }
  }

  async executeCode(
    code: string,
    testCase: TestCase,
  ): Promise<ExecutionResult> {
    if (!(await this.checkDockerAvailability())) {
      return {
        status: "INTERNAL_ERROR",
        errorMessage:
          "Docker is not available. Please ensure Docker is installed and running.",
      };
    }

    if (!(await this.ensureDockerImage())) {
      return {
        status: "INTERNAL_ERROR",
        errorMessage: `Failed to ensure Docker image ${this.dockerImage} is available.`,
      };
    }

    const executionId = randomUUID();
    const tempDir = join(cwd(), `execution_${executionId}`);
    const fileName = this.mainFileName || `Solution.${this.fileExtension}`;
    this.tempExecutionDir = tempDir;
    // Ensure temp directory is accessible and has correct permissions
    try {
      await execAsync(
        `sudo mkdir -p "${tempDir}" && sudo chmod 777 "${tempDir}"`,
      );
    } catch (error) {
      console.error("Failed to create temp directory:", error);
      return {
        status: "INTERNAL_ERROR",
        errorMessage: "Failed to create temporary directory for code execution",
      };
    }
    const filePath = join(tempDir, fileName);

    try {
      await mkdir(tempDir, { recursive: true });
      await writeFile(filePath, code);
      if (this.compileCommand) {
        const compileResult = await this.compile(tempDir, fileName);
        if (!compileResult.success) {
          return {
            status: "COMPILATION_ERROR",
            errorMessage: compileResult.error,
            compilationOutput: compileResult.output,
          };
        }
      }

      // console.log("After compilation");
      return await this.execute(tempDir, fileName, testCase);
    } catch (error) {
      console.error("Execution error:", error);
      return {
        status: "INTERNAL_ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      // Cleanup
      try {
        await this.cleanup(tempDir);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }
  }

  private async compile(
    workDir: string,
    fileName: string,
  ): Promise<{ success: boolean; error?: string; output?: string }> {
    if (!this.compileCommand) return { success: true };

    try {
      const command = this.compileCommand.replace(/\$\{fileName\}/g, fileName);
      const { stdout, stderr } = await execAsync(command, {
        cwd: workDir,
        timeout: 30000, // 30 seconds compile timeout
      });

      return {
        success: true,
        output: stdout + stderr,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.stderr || error.message || "Compilation failed",
        output: error.stdout || "",
      };
    }
  }

  private async execute(
    workDir: string,
    fileName: string,
    testCase: TestCase,
  ): Promise<ExecutionResult> {
    try {
      console.log("Before Docker command, Textcase: \n", testCase);
      // const dockerCommand = this.buildDockerCommand(
      //   workDir,
      //   fileName,
      //   testCase,
      // );
      const dockerCommand = this.buildDockerCommand(fileName, testCase);
      const startTime = Date.now();

      // console.log("Before Execution of Docker command: \n", dockerCommand);
      const { stdout, stderr } = await execAsync(dockerCommand, {
        timeout: testCase.timeLimit + 100000, // Add 5s buffer for Docker overhead
        maxBuffer: 10 * 1024 * 1024, // 10MB output limit
      });
      console.log("After Execution");
      console.log("Stdout: ", stdout);
      console.log("Stderr: ", stderr);
      const runtime = Date.now() - startTime;

      // Parse Docker stats output to get actual memory usage
      const memoryUsage = this.parseMemoryUsage(stderr);

      if (
        stderr &&
        stderr.includes("ERROR") &&
        !stderr.includes("DOCKER_STATS:")
      ) {
        return {
          status: "RUNTIME_ERROR",
          errorMessage: this.cleanErrorMessage(stderr),
          runtime,
          memory: memoryUsage,
        };
      }

      const actualOutput = this.cleanOutput(stdout);
      const expectedOutput = this.cleanOutput(testCase.expectedOutput);

      const isCorrect = this.compareOutputs(actualOutput, expectedOutput);

      return {
        status: isCorrect ? "ACCEPTED" : "WRONG_ANSWER",
        output: actualOutput,
        runtime: Math.max(0, runtime - 1000), // Subtract Docker overhead
        memory: memoryUsage,
      };
    } catch (error: any) {
      const runtime = Date.now() - Date.now();

      if (error.code === "TIMEOUT" || error.killed) {
        return {
          status: "TIME_LIMIT_EXCEEDED",
          runtime: testCase.timeLimit,
          errorMessage: `Time limit exceeded (${testCase.timeLimit}ms)`,
        };
      }

      return {
        status: "RUNTIME_ERROR",
        runtime,
        errorMessage: this.cleanErrorMessage(
          error.message || "Runtime error occurred",
        ),
      };
    }
  }

  private buildDockerCommand(fileName: string, testCase: TestCase): string {
    // const timeoutSeconds = Math.ceil(testCase.timeLimit / 1000);
    const timeoutSeconds = 10;
    const memoryLimit = testCase.memoryLimit;
    const input = testCase.input
      .replace(/"/g, '\\"')
      .replace(/\$/g, "\\$")
      .replace(/`/g, "\\`");
    const runCmd = this.runCommand.replace(/\$\{fileName\}/g, fileName);

    return (
      `printf '%s\\n' "${input}" | timeout ${timeoutSeconds}s docker run --rm -i ` +
      `--memory=${memoryLimit}m ` +
      `--memory-swap=${memoryLimit}m ` +
      `--cpus="1.0" ` +
      `--network=none ` +
      `--security-opt=no-new-privileges ` +
      `--cap-drop=ALL ` +
      `--pids-limit=50 ` +
      `-v "${this.tempExecutionDir}/${fileName}:/tmp/${fileName}:ro" ` +
      `${this.dockerImage} ` +
      // `bash -c "cd /tmp && g++ -std=c++17 -O2 -o solution ${fileName} 2>&1 && ./solution 2>&1"`
      `${this.shell} -c "${runCmd}"`
    );
  }

  private escapeInput(input: string): string {
    return input.replace(/"/g, '\\"').replace(/\$/g, "\\").replace(/`/g, "\\`");
  }

  private parseMemoryUsage(stderr: string): number {
    const match = stderr.match(/DOCKER_STATS:(\d+)/);
    if (match) {
      return Math.floor(parseInt(match[1]) / 1024); // Convert to KB
    }
    return 0;
  }

  private cleanOutput(output: string): string {
    return output.trim().replace(/\r\n/g, "\n");
  }

  private cleanErrorMessage(error: string): string {
    // Remove Docker-specific error messages and keep only relevant parts
    return error
      .replace(/docker: .*?\n/g, "")
      .replace(/container_linux\.go.*?\n/g, "")
      .replace(/DOCKER_STATS:.*?\n/g, "")
      .trim();
  }

  private compareOutputs(actual: string, expected: string): boolean {
    // Normalize whitespace and compare
    const normalizeOutput = (str: string) =>
      str
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n");

    return normalizeOutput(actual) === normalizeOutput(expected);
  }

  private async cleanup(tempDir: string): Promise<void> {
    try {
      await execAsync(`sudo rm -rf "${tempDir}"`);
    } catch (error) {
      console.error("Failed to cleanup temporary directory:", error);
    }
  }
}
