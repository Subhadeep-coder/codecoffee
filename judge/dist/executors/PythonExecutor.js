"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class PythonExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "py";
        this.runCommand = "python3 ${fileName}";
        this.dockerImage = "python:3.9-alpine";
        this.mainFileName = "solution.py";
    }
}
exports.PythonExecutor = PythonExecutor;
