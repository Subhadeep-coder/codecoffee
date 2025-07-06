"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class CExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "c";
        this.compileCommand = "gcc -std=c11 -O2 -o solution ${fileName}";
        this.runCommand = "./solution";
        this.dockerImage = "gcc:12.4.0-bookworm";
        this.mainFileName = "solution.c";
    }
}
exports.CExecutor = CExecutor;
