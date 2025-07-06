import { JudgingService } from "./services/JudgingService";
import { SubmissionQueue } from "./queue/SubmissionQueue";

export class JudgeWorker {
  private judgingService: JudgingService;
  private queue: SubmissionQueue;
  private isRunning = false;
  private processingCount = 0;
  private maxConcurrentJobs = 3; // Limit concurrent executions

  constructor() {
    this.judgingService = new JudgingService();
    this.queue = new SubmissionQueue();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log("Judge worker started...");

    // Start multiple worker processes
    const workers = [];
    for (let i = 0; i < this.maxConcurrentJobs; i++) {
      workers.push(this.workerLoop(i));
    }

    await Promise.all(workers);
  }

  private async workerLoop(workerId: number): Promise<void> {
    console.log(`Worker ${workerId} started`);

    while (this.isRunning) {
      try {
        const submission = await this.queue.getNextSubmission();
        if (submission) {
          this.processingCount++;
          console.log(
            `Worker ${workerId}: Processing submission ${submission.id} (${this.processingCount} active jobs)`,
          );

          const startTime = Date.now();
          const result =
            await this.judgingService.processSubmission(submission);
          const processingTime = Date.now() - startTime;

          await this.queue.markCompleted(submission.id);
          this.processingCount--;

          console.log(
            `Worker ${workerId}: Completed submission ${submission.id} with status ${result.status} in ${processingTime}ms`,
          );
        } else {
          // No submissions available, wait a bit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Worker ${workerId} error:`, error);
        this.processingCount = Math.max(0, this.processingCount - 1);

        // Wait before retrying on error
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    console.log(`Worker ${workerId} stopped`);
  }

  stop(): void {
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
