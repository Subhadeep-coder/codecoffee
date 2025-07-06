"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class TypeScriptExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "ts";
        this.compileCommand = "npx tsc ${fileName} --target es2020 --module commonjs --outDir .";
        this.runCommand = "node solution.js";
        this.dockerImage = "node:18-alpine";
        this.mainFileName = "solution.ts";
    }
}
exports.TypeScriptExecutor = TypeScriptExecutor;
