"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExecutor = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const crypto_1 = require("crypto");
const process_1 = require("process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class BaseExecutor {
    constructor() {
        this.tempExecutionDir = "/";
    }
    checkDockerAvailability() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield execAsync("docker ps");
                return true;
            }
            catch (error) {
                console.error("Docker is not available:", error);
                return false;
            }
        });
    }
    ensureDockerImage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield execAsync(`docker image inspect ${this.dockerImage}`);
                return true;
            }
            catch (error) {
                try {
                    console.log(`Pulling Docker image: ${this.dockerImage}`);
                    yield execAsync(`docker pull ${this.dockerImage}`);
                    return true;
                }
                catch (pullError) {
                    console.error(`Failed to pull Docker image ${this.dockerImage}:`, pullError);
                    return false;
                }
            }
        });
    }
    executeCode(code, testCase) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check Docker availability first
            if (!(yield this.checkDockerAvailability())) {
                return {
                    status: "INTERNAL_ERROR",
                    errorMessage: "Docker is not available. Please ensure Docker is installed and running.",
                };
            }
            // Ensure Docker image is available
            if (!(yield this.ensureDockerImage())) {
                return {
                    status: "INTERNAL_ERROR",
                    errorMessage: `Failed to ensure Docker image ${this.dockerImage} is available.`,
                };
            }
            const executionId = (0, crypto_1.randomUUID)();
            const tempDir = (0, path_1.join)((0, process_1.cwd)(), `execution_${executionId}`);
            const fileName = this.mainFileName || `Solution.${this.fileExtension}`;
            this.tempExecutionDir = tempDir;
            // Ensure temp directory is accessible and has correct permissions
            try {
                yield execAsync(`sudo mkdir -p "${tempDir}" && sudo chmod 777 "${tempDir}"`);
            }
            catch (error) {
                console.error("Failed to create temp directory:", error);
                return {
                    status: "INTERNAL_ERROR",
                    errorMessage: "Failed to create temporary directory for code execution",
                };
            }
            const filePath = (0, path_1.join)(tempDir, fileName);
            try {
                yield (0, promises_1.mkdir)(tempDir, { recursive: true });
                yield (0, promises_1.writeFile)(filePath, code);
                console.log("Before compilation");
                // Compile if needed
                if (this.compileCommand) {
                    const compileResult = yield this.compile(tempDir, fileName);
                    if (!compileResult.success) {
                        return {
                            status: "COMPILATION_ERROR",
                            errorMessage: compileResult.error,
                            compilationOutput: compileResult.output,
                        };
                    }
                }
                console.log("After compilation");
                // Execute with proper resource monitoring
                return yield this.execute(tempDir, fileName, testCase);
            }
            catch (error) {
                console.error("Execution error:", error);
                return {
                    status: "INTERNAL_ERROR",
                    errorMessage: error instanceof Error ? error.message : "Unknown error",
                };
            }
            finally {
                // Cleanup
                try {
                    yield this.cleanup(tempDir);
                }
                catch (cleanupError) {
                    console.error("Cleanup error:", cleanupError);
                }
            }
        });
    }
    compile(workDir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.compileCommand)
                return { success: true };
            try {
                const command = this.compileCommand.replace(/\$\{fileName\}/g, fileName);
                const { stdout, stderr } = yield execAsync(command, {
                    cwd: workDir,
                    timeout: 30000, // 30 seconds compile timeout
                });
                return {
                    success: true,
                    output: stdout + stderr,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error.stderr || error.message || "Compilation failed",
                    output: error.stdout || "",
                };
            }
        });
    }
    execute(workDir, fileName, testCase) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Before Docker command, Textcase: \n", testCase);
                // const dockerCommand = this.buildDockerCommand(
                //   workDir,
                //   fileName,
                //   testCase,
                // );
                const dockerCommand = this.buildDockerCommand(fileName, testCase);
                const startTime = Date.now();
                console.log("Before Execution of Docker command: \n", dockerCommand);
                const { stdout, stderr } = yield execAsync(dockerCommand, {
                    timeout: testCase.timeLimit + 100000, // Add 5s buffer for Docker overhead
                    maxBuffer: 10 * 1024 * 1024, // 10MB output limit
                });
                console.log("After Execution");
                console.log("Stdout: ", stdout);
                console.log("Stderr: ", stderr);
                const runtime = Date.now() - startTime;
                // Parse Docker stats output to get actual memory usage
                const memoryUsage = this.parseMemoryUsage(stderr);
                if (stderr &&
                    stderr.includes("ERROR") &&
                    !stderr.includes("DOCKER_STATS:")) {
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
            }
            catch (error) {
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
                    errorMessage: this.cleanErrorMessage(error.message || "Runtime error occurred"),
                };
            }
        });
    }
    buildDockerCommand(fileName, testCase) {
        // const timeoutSeconds = Math.ceil(testCase.timeLimit / 1000);
        const timeoutSeconds = 10;
        const memoryLimit = testCase.memoryLimit;
        const input = testCase.input;
        // .replace(/"/g, '\\"')
        // .replace(/\$/g, "\\$")
        // .replace(/`/g, "\\`");
        console.log("Input:\n");
        console.table(input);
        const runCmd = this.runCommand.replace(/\$\{fileName\}/g, fileName);
        return (`printf '%s\\n' "${input}" | timeout ${timeoutSeconds}s docker run --rm -i ` +
            `--memory=${memoryLimit}m ` +
            `--memory-swap=${memoryLimit}m ` +
            `--cpus="1.0" ` +
            `--network=none ` +
            `--security-opt=no-new-privileges ` +
            `--cap-drop=ALL ` +
            `--pids-limit=50 ` +
            `-v "${this.tempExecutionDir}/${fileName}:/tmp/${fileName}:ro" ` +
            `gcc:12.4.0-bookworm ` +
            // `bash -c "cd /tmp && g++ -std=c++17 -O2 -o solution ${fileName} 2>&1 && ./solution 2>&1"`
            `bash -c "${runCmd}"`);
    }
    escapeInput(input) {
        return input.replace(/"/g, '\\"').replace(/\$/g, "\\").replace(/`/g, "\\`");
    }
    parseMemoryUsage(stderr) {
        const match = stderr.match(/DOCKER_STATS:(\d+)/);
        if (match) {
            return Math.floor(parseInt(match[1]) / 1024); // Convert to KB
        }
        return 0;
    }
    cleanOutput(output) {
        return output.trim().replace(/\r\n/g, "\n");
    }
    cleanErrorMessage(error) {
        // Remove Docker-specific error messages and keep only relevant parts
        return error
            .replace(/docker: .*?\n/g, "")
            .replace(/container_linux\.go.*?\n/g, "")
            .replace(/DOCKER_STATS:.*?\n/g, "")
            .trim();
    }
    compareOutputs(actual, expected) {
        // Normalize whitespace and compare
        const normalizeOutput = (str) => str
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n/g, "\n");
        return normalizeOutput(actual) === normalizeOutput(expected);
    }
    cleanup(tempDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield execAsync(`sudo rm -rf "${tempDir}"`);
            }
            catch (error) {
                console.error("Failed to cleanup temporary directory:", error);
            }
        });
    }
}
exports.BaseExecutor = BaseExecutor;
