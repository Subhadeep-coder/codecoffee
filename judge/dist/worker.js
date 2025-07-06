"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeWorker = void 0;
const JudgingService_1 = require("./services/JudgingService");
const SubmissionQueue_1 = require("./queue/SubmissionQueue");
class JudgeWorker {
    constructor() {
        this.isRunning = false;
        this.processingCount = 0;
        this.maxConcurrentJobs = 3; // Limit concurrent executions
        this.judgingService = new JudgingService_1.JudgingService();
        this.queue = new SubmissionQueue_1.SubmissionQueue();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isRunning = true;
            console.log("Judge worker started...");
            // Start multiple worker processes
            const workers = [];
            for (let i = 0; i < this.maxConcurrentJobs; i++) {
                workers.push(this.workerLoop(i));
            }
            yield Promise.all(workers);
        });
    }
    workerLoop(workerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Worker ${workerId} started`);
            while (this.isRunning) {
                try {
                    const submission = yield this.queue.getNextSubmission();
                    if (submission) {
                        this.processingCount++;
                        console.log(`Worker ${workerId}: Processing submission ${submission.id} (${this.processingCount} active jobs)`);
                        const startTime = Date.now();
                        const result = yield this.judgingService.processSubmission(submission);
                        const processingTime = Date.now() - startTime;
                        yield this.queue.markCompleted(submission.id);
                        this.processingCount--;
                        console.log(`Worker ${workerId}: Completed submission ${submission.id} with status ${result.status} in ${processingTime}ms`);
                    }
                    else {
                        // No submissions available, wait a bit
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
                catch (error) {
                    console.error(`Worker ${workerId} error:`, error);
                    this.processingCount = Math.max(0, this.processingCount - 1);
                    // Wait before retrying on error
                    yield new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
            console.log(`Worker ${workerId} stopped`);
        });
    }
    stop() {
        this.isRunning = false;
        console.log("Judge worker stopping...");
    }
    getStatus() {
        return {
            isRunning: this.isRunning,
            processingCount: this.processingCount,
            maxConcurrentJobs: this.maxConcurrentJobs,
        };
    }
}
exports.JudgeWorker = JudgeWorker;
