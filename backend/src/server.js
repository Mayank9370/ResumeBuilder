import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config.js";

// Import routes
import authRoutes from "./modules/auth/auth.routes.js";
import resumeRoutes from "./modules/resume/resume.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import downloadRoutes from "./modules/resume/download.routes.js";

// Load environment variables
dotenv.config();

/**
 * Resume Builder Backend Server
 * Modular architecture with feature-based organization
 */

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// MIDDLEWARE
// ======================

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // React dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Cookie parsing (for JWT tokens)
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// ======================
// ROUTES
// ======================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Resume Builder API",
    version: "2.0.0",
  });
});

// API documentation
app.get("/", (req, res) => {
  res.json({
    message: "Resume Builder API",
    version: "2.0.0",
    documentation: {
      auth: "/api/auth",
      resume: "/api/resume",
    },
    endpoints: {
      auth: {
        "GET /api/auth/google": "Initiate Google OAuth login",
        "GET /api/auth/google/callback": "Google OAuth callback",
        "POST /api/auth/logout": "Logout user",
        "GET /api/auth/me": "Get current user (protected)",
        "GET /api/auth/verify": "Verify token (protected)",
      },
      resume: {
        "POST /api/resume": "Create resume (protected)",
        "GET /api/resume": "Get all user resumes (protected)",
        "GET /api/resume/:id": "Get resume by ID (protected)",
        "PATCH /api/resume/:id": "Update resume (protected)",
        "DELETE /api/resume/:id": "Delete resume (protected)",
        "POST /api/resume/:id/duplicate": "Duplicate resume (protected)",
        "POST /api/resume/upload": "Upload & parse resume file (protected)",
        "POST /api/resume/extract-text": "Extract text from file (protected)",
        "GET /api/resume/source-resumes":
          "Get source resume library (protected)",
      },
    },
  });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resumes", resumeRoutes); // Fix: Alias for plural usage in Frontend
app.use("/api/ai", aiRoutes);
app.use("/api/download", downloadRoutes);

// ======================
// ERROR HANDLING
// ======================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Resume Builder Backend Server");
  console.log("=".repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? "✓ Configured" : "✗ Not configured"}`,
  );
  console.log(
    `🤖 AI Services: ${process.env.XIAOMI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GOOGLE_API_KEY ? "✓ Available" : "✗ Not configured"}`,
  );
  console.log("=".repeat(60));
  console.log("\n📚 Features:");
  console.log("  ✓ Auth (Google OAuth + JWT)");
  console.log("  ✓ Resume (Create, Upload, Parse)");
  console.log("\n" + "=".repeat(60) + "\n");
});

export default app;
