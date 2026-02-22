import express from "express";
import { CORS_DOMAIN_FIRST, CORS_DOMAIN_SECOND } from "./config";
import authRoutes from "./routes/auth.route";
import consumerRoutes from "./routes/consumer.route";
import retailerRoutes from "./routes/retailer.route";
import adminRoutes from "./routes/admin.routes";
import productRouter from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import collectionRoutes from "./routes/collection.routes";
import cors from "cors";
import path from "path";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- Rate Limiter Setup ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter globally
app.use(limiter);

// --- CORS Setup ---
const allowedOrigins = [CORS_DOMAIN_FIRST, CORS_DOMAIN_SECOND];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/consumers", consumerRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/collections", collectionRoutes);

// --- Error Handler ---
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status = err.statusCode ?? 500;
    res.status(status).json({
      success: false,
      message: err.message || "Internal server error",
    });
  },
);

export default app;
