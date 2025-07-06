"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CppExecutor = void 0;
const BaseExecutor_1 = require("./BaseExecutor");
class CppExecutor extends BaseExecutor_1.BaseExecutor {
    constructor() {
        super(...arguments);
        this.fileExtension = "cpp";
        this.compileCommand = undefined;
        // Compile in /tmp (writable) and then execute
        this.runCommand = "cd /tmp && g++ -std=c++17 -O2 -o solution ${fileName} && ./solution";
        this.dockerImage = "gcc:12.4.0-bookworm";
        this.mainFileName = "solution.cpp";
    }
}
exports.CppExecutor = CppExecutor;
