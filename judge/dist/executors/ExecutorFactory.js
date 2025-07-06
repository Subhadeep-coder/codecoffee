"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutorFactory = void 0;
const PythonExecutor_1 = require("./PythonExecutor");
const JavaScriptExecutor_1 = require("./JavaScriptExecutor");
const JavaExecutor_1 = require("./JavaExecutor");
const TypeScriptExecutor_1 = require("./TypeScriptExecutor");
const CppExecutor_1 = require("./CppExecutor");
const CExecutor_1 = require("./CExecutor");
class ExecutorFactory {
    static getExecutor(language) {
        switch (language.toLowerCase()) {
            case "python":
            case "python3":
                return new PythonExecutor_1.PythonExecutor();
            case "javascript":
            case "js":
                return new JavaScriptExecutor_1.JavaScriptExecutor();
            case "typescript":
            case "ts":
                return new TypeScriptExecutor_1.TypeScriptExecutor();
            case "java":
                return new JavaExecutor_1.JavaExecutor();
            case "cpp":
            case "c++":
                return new CppExecutor_1.CppExecutor();
            case "c":
                return new CExecutor_1.CExecutor();
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
    }
    static getSupportedLanguages() {
        return ["python", "javascript", "typescript", "java", "cpp", "c"];
    }
}
exports.ExecutorFactory = ExecutorFactory;
