"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class JavaScriptExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "js";
        this.runCommand = "node ${fileName}";
        this.dockerImage = "node:16-alpine";
        this.mainFileName = "solution.js";
    }
}
exports.JavaScriptExecutor = JavaScriptExecutor;
