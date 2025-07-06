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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionQueue = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class SubmissionQueue {
    constructor() {
        this.QUEUE_KEY = 'submission_queue';
        this.PROCESSING_KEY = 'processing_submissions';
        this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
    }
    addSubmission(submission) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.lpush(this.QUEUE_KEY, JSON.stringify(submission));
        });
    }
    getNextSubmission() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.redis.brpoplpush(this.QUEUE_KEY, this.PROCESSING_KEY, 10 // timeout in seconds
            );
            if (!result)
                return null;
            return JSON.parse(result);
        });
    }
    markCompleted(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove from processing queue
            const processingSubmissions = yield this.redis.lrange(this.PROCESSING_KEY, 0, -1);
            for (let i = 0; i < processingSubmissions.length; i++) {
                const submission = JSON.parse(processingSubmissions[i]);
                if (submission.id === submissionId) {
                    yield this.redis.lrem(this.PROCESSING_KEY, 1, processingSubmissions[i]);
                    break;
                }
            }
        });
    }
    getQueueLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.llen(this.QUEUE_KEY);
        });
    }
}
exports.SubmissionQueue = SubmissionQueue;
