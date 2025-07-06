import { BaseExecutor } from "./BaseExecutor";

export class CppExecutor extends BaseExecutor {
  protected readonly fileExtension = "cpp";
  protected readonly compileCommand = undefined;
  // Compile in /tmp (writable) and then execute
  protected readonly runCommand =
    "cd /tmp && g++ -std=c++17 -O2 -o solution ${fileName} && ./solution";
  protected readonly dockerImage = "gcc:12.4.0-bookworm";
  protected readonly mainFileName = "solution.cpp";
}
