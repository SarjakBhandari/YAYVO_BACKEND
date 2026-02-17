import express from "express";
import { CORS_DOMAIN_FIRST, CORS_DOMAIN_SECOND } from "./config";
import authRoutes from "./routes/auth.route";
import consumerRoutes from "./routes/consumer.route";
import retailerRoutes from "./routes/retailer.route";
import adminRoutes from "./routes/admin.routes";
import productRouter from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import cors from "cors";
import path from "path";

import collectionRoutes from "./routes/collection.routes";


const app = express();
app.use(express.json());
// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const allowedOrigins = [CORS_DOMAIN_FIRST, CORS_DOMAIN_SECOND];
// keep your two domains
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // allow requests with no origin (like curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  credentials: true, // <--- MUST be true when frontend sends cookies/credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions)); // Ensure preflight requests are handled and return the same CORS headers app.options("*", cors(corsOptions));
// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/consumers", consumerRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/collections", collectionRoutes);

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status = err.statusCode ?? 500;
    res
      .status(status)
      .json({
        success: false,
        message: err.message || "Internal server error",
      });
  },
);

export default app;
