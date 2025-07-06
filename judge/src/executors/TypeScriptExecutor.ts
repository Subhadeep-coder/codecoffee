import { BaseExecutor } from "./BaseExecutor";

export class TypeScriptExecutor extends BaseExecutor {
  protected readonly fileExtension = "ts";
  protected readonly compileCommand =
    "npx tsc ${fileName} --target es2020 --module commonjs --outDir .";
  protected readonly runCommand = "node solution.js";
  protected readonly dockerImage = "node:18-alpine";
  protected readonly mainFileName = "solution.ts";
}
