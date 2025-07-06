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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const SubmissionQueue_1 = require("../queue/SubmissionQueue");
const TemplateManager_1 = require("../templates/TemplateManager");
const ExecutorFactory_1 = require("../executors/ExecutorFactory");
const JudgingService_1 = require("../services/JudgingService");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
// CORS middleware for development
exports.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
const prisma = new client_1.PrismaClient();
const submissionQueue = new SubmissionQueue_1.SubmissionQueue();
const judgingService = new JudgingService_1.JudgingService();
// Submit code for judging
exports.app.post("/submission", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { problemId, code, language, userId } = req.body;
        // Use default userId if not provided (for testing)
        // const actualUserId = userId || "default-user-id";
        console.log("Received submission request:", {
            problemId,
            language,
            codeLength: code === null || code === void 0 ? void 0 : code.length,
        });
        if (!problemId || !code || !language) {
            return res.status(400).json({
                error: "Missing required fields: problemId, code, language",
            });
        }
        // Validate problem exists
        const problem = yield prisma.problem.findUnique({
            where: { id: problemId },
        });
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }
        // Validate language support
        const supportedLanguages = ExecutorFactory_1.ExecutorFactory.getSupportedLanguages();
        if (!supportedLanguages.includes(language.toLowerCase())) {
            return res.status(400).json({
                error: `Unsupported language. Supported languages: ${supportedLanguages.join(", ")}`,
            });
        }
        // Create submission record
        const submission = yield prisma.submission.create({
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
        yield submissionQueue.addSubmission({
            id: submission.id,
            userId: userId,
            problemId,
            code,
            language: language.toLowerCase(),
        });
        console.log(`Submission ${submission.id} added to queue`);
        res.status(201).json({
            submissionId: submission.id,
            status: "PENDING",
            message: "Submission added to judging queue",
        });
    }
    catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Get submission result
exports.app.get("/submission/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Here in the get submission request");
        const { id: submissionId } = req.params;
        if (!submissionId) {
            return res.status(400).json({ error: "Missing submissionId" });
        }
        const submission = yield prisma.submission.findUnique({
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
    }
    catch (error) {
        console.error("Get submission error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Get problem template
exports.app.get("/problem/:id/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: problemId } = req.params;
        const { language } = req.query;
        if (!problemId || !language) {
            return res
                .status(400)
                .json({ error: "Missing problemId or language parameter" });
        }
        const problem = yield prisma.problem.findUnique({
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
            const template = TemplateManager_1.TemplateManager.getTemplate(language);
            res.json({
                problemId: problem.id,
                problemTitle: problem.title,
                language: language,
                template: template,
                supportedLanguages: TemplateManager_1.TemplateManager.getSupportedLanguages(),
            });
        }
        catch (templateError) {
            console.error("Template error:", templateError);
            return res.status(400).json({
                error: templateError instanceof Error
                    ? templateError.message
                    : "Template not found",
            });
        }
    }
    catch (error) {
        console.error("Template fetch error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Get supported languages
exports.app.get("/languages", (req, res) => {
    res.json({
        supported: ExecutorFactory_1.ExecutorFactory.getSupportedLanguages(),
        templates: TemplateManager_1.TemplateManager.getSupportedLanguages(),
    });
});
// Health check endpoint
exports.app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
// Get queue status (for monitoring)
exports.app.get("/queue/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queueLength = yield submissionQueue.getQueueLength();
        res.json({
            queueLength,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get queue status" });
    }
}));
