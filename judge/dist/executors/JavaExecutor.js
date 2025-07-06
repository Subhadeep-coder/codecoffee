"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class JavaExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "java";
        this.compileCommand = "javac *.java";
        this.runCommand = "java Main";
        this.dockerImage = "openjdk:17-alpine";
        this.mainFileName = "Main.java";
    }
}
exports.JavaExecutor = JavaExecutor;
