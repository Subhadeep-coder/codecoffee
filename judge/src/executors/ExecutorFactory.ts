import { BaseExecutor } from "./BaseExecutor";
import { PythonExecutor } from "./PythonExecutor";
import { JavaScriptExecutor } from "./JavaScriptExecutor";
import { JavaExecutor } from "./JavaExecutor";
import { TypeScriptExecutor } from "./TypeScriptExecutor";
import { CppExecutor } from "./CppExecutor";
import { CExecutor } from "./CExecutor";

export class ExecutorFactory {
  static getExecutor(language: string): BaseExecutor {
    switch (language.toLowerCase()) {
      case "python":
      case "python3":
        return new PythonExecutor();
      case "javascript":
      case "js":
        return new JavaScriptExecutor();
      case "typescript":
      case "ts":
        return new TypeScriptExecutor();
      case "java":
        return new JavaExecutor();
      case "cpp":
      case "c++":
        return new CppExecutor();
      case "c":
        return new CExecutor();
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  static getSupportedLanguages(): string[] {
    return ["python", "javascript", "typescript", "java", "cpp", "c"];
  }
}
