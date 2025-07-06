"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const submission_1 = require("./api/submission");
const worker_1 = require("./worker");
const PORT = process.env.PORT || 9000;
// Graceful shutdown handling
let worker;
const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    if (worker) {
        worker.stop();
    }
    process.exit(0);
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
// Start server
submission_1.app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    // Start the judge worker
    worker = new worker_1.JudgeWorker();
    worker.start().catch((error) => {
        console.error("Worker failed to start:", error);
        process.exit(1);
    });
});
