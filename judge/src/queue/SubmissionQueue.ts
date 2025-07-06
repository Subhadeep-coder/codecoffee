import Redis from 'ioredis';
import { SubmissionRequest } from '../types';

export class SubmissionQueue {
    private redis: Redis;
    private readonly QUEUE_KEY = 'submission_queue';
    private readonly PROCESSING_KEY = 'processing_submissions';

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    }

    async addSubmission(submission: SubmissionRequest): Promise<void> {
        await this.redis.lpush(this.QUEUE_KEY, JSON.stringify(submission));
    }

    async getNextSubmission(): Promise<SubmissionRequest | null> {
        const result = await this.redis.brpoplpush(
            this.QUEUE_KEY,
            this.PROCESSING_KEY,
            10 // timeout in seconds
        );

        if (!result) return null;

        return JSON.parse(result);
    }

    async markCompleted(submissionId: string): Promise<void> {
        // Remove from processing queue
        const processingSubmissions = await this.redis.lrange(this.PROCESSING_KEY, 0, -1);
        for (let i = 0; i < processingSubmissions.length; i++) {
            const submission = JSON.parse(processingSubmissions[i]);
            if (submission.id === submissionId) {
                await this.redis.lrem(this.PROCESSING_KEY, 1, processingSubmissions[i]);
                break;
            }
        }
    }

    async getQueueLength(): Promise<number> {
        return await this.redis.llen(this.QUEUE_KEY);
    }
}