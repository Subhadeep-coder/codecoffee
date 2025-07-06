import { BaseExecutor } from "./BaseExecutor";

export class JavaExecutor extends BaseExecutor {
  protected readonly fileExtension = "java";
  protected readonly compileCommand = "javac *.java";
  protected readonly runCommand = "java Main";
  protected readonly dockerImage = "openjdk:17-alpine";
  protected readonly mainFileName = "Main.java";
}
