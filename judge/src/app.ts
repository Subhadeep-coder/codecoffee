import { app } from "./api/submission";
import { JudgeWorker } from "./worker";

const PORT = process.env.PORT || 9000;

// Graceful shutdown handling
let worker: JudgeWorker;

const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);

  if (worker) {
    worker.stop();
  }

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  // Start the judge worker
  worker = new JudgeWorker();
  worker.start().catch((error) => {
    console.error("Worker failed to start:", error);
    process.exit(1);
  });
});
