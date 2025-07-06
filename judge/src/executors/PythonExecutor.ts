import { BaseExecutor } from "./BaseExecutor";

export class PythonExecutor extends BaseExecutor {
  protected compileCommand?: string | undefined;
  protected readonly fileExtension = "py";
  protected readonly runCommand = "python3 ${fileName}";
  protected readonly dockerImage = "python:3.9-alpine";
  protected readonly mainFileName = "solution.py";
}
