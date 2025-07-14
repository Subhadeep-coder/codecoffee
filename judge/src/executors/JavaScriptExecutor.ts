import { BaseExecutor } from "./BaseExecutor";

export class JavaScriptExecutor extends BaseExecutor {
  protected compileCommand?: string | undefined;
  protected readonly fileExtension = "js";
  protected readonly runCommand = "node ${fileName}";
  protected readonly dockerImage = "node:16-alpine";
  protected readonly mainFileName = "solution.js";
}
