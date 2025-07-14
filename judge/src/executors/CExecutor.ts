import { BaseExecutor } from "./BaseExecutor";

export class CExecutor extends BaseExecutor {
  protected readonly fileExtension = "c";
  protected readonly compileCommand =
    "gcc -std=c11 -O2 -o solution ${fileName}";
  protected readonly runCommand = "./solution";
  protected readonly dockerImage = "gcc:12.4.0-bookworm";
  protected readonly mainFileName = "solution.c";
}
