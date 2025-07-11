import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SubmissionQueue } from "../queue/SubmissionQueue";
import { TemplateManager } from "../templates/TemplateManager";
import { ExecutorFactory } from "../executors/ExecutorFactory";
import { JudgingService } from "../services/JudgingService";

export const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const prisma = new PrismaClient();
const submissionQueue = new SubmissionQueue();
const judgingService = new JudgingService();

// Submit code for judging
app.post("/submission", async (req: Request, res: Response): Promise<any> => {
  try {
    const { problemId, code, language, userId } = req.body;
    const { mode = "run" } = req.query;
    // Use default userId if not provided (for testing)
    // const actualUserId = userId || "default-user-id";

    console.log("Received submission request:", {
      problemId,
      language,
      codeLength: code?.length,
      mode,
    });

    if (!problemId || !code || !language) {
      return res.status(400).json({
        error: "Missing required fields: problemId, code, language",
      });
    }

    // Validate problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Validate language support
    const supportedLanguages = ExecutorFactory.getSupportedLanguages();
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        error: `Unsupported language. Supported languages: ${supportedLanguages.join(", ")}`,
      });
    }

    if (mode === "submit") {
      console.log("Here");
      // Create submission record
      const submission = await prisma.submission.create({
        data: {
          userId: userId,
          problemId,
          code,
          language: language.toLowerCase(),
          status: "PENDING",
          submittedAt: new Date(),
        },
      });

      // Add to processing queue
      await submissionQueue.addSubmission({
        id: submission.id,
        userId: userId,
        problemId,
        code,
        language: language.toLowerCase(),
        mode: "submit",
      });
      console.log(`Submission ${submission.id} added to queue`);

      return res.status(201).json({
        submissionId: submission.id,
        status: "PENDING",
        message: "Submission added to judging queue",
      });
    }

    await submissionQueue.addSubmission({
      id: `run:${problemId}`,
      userId: userId,
      problemId,
      code,
      language: language.toLowerCase(),
      mode: "run",
    });
    console.log(`Test run:${problemId} added to queue`);

    return res.status(201).json({
      submissionId: `run:${problemId}`,
      status: "PENDING",
      message: "Test added to judging queue",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get submission result
app.get(
  "/submission/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id: submissionId } = req.params;

      if (!submissionId) {
        return res.status(400).json({ error: "Missing submissionId" });
      }

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          problem: {
            select: { title: true, difficulty: true },
          },
        },
      });

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      console.log("Submission: ", submission.id, submission.status);

      res.json({
        id: submission.id,
        status: submission.status,
        testCasesPassed: submission.testCasesPassed,
        totalTestCases: submission.totalTestCases,
        runtime: submission.runtime,
        memory: submission.memory,
        errorMessage: submission.errorMessage,
        submittedAt: submission.submittedAt,
        problem: submission.problem,
      });
    } catch (error) {
      console.error("Get submission error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Get problem template
app.get(
  "/problem/:id/template",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id: problemId } = req.params;
      const { language } = req.query;

      if (!problemId || !language) {
        return res
          .status(400)
          .json({ error: "Missing problemId or language parameter" });
      }

      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          // Add any problem-specific template configuration
        },
      });

      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }

      try {
        const template = TemplateManager.getTemplate(language as string);

        res.json({
          problemId: problem.id,
          problemTitle: problem.title,
          language: language,
          template: template,
          supportedLanguages: TemplateManager.getSupportedLanguages(),
        });
      } catch (templateError) {
        console.error("Template error:", templateError);
        return res.status(400).json({
          error:
            templateError instanceof Error
              ? templateError.message
              : "Template not found",
        });
      }
    } catch (error) {
      console.error("Template fetch error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Get supported languages
app.get("/languages", (req: Request, res: Response) => {
  res.json({
    supported: ExecutorFactory.getSupportedLanguages(),
    templates: TemplateManager.getSupportedLanguages(),
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Get queue status (for monitoring)
app.get("/queue/status", async (req: Request, res: Response) => {
  try {
    const queueLength = await submissionQueue.getQueueLength();
    res.json({
      queueLength,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get queue status" });
  }
});
