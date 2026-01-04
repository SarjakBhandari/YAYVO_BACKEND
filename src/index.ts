import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config";
import authRoutes from "./routes/auth.route";
import consumerRoutes from "./routes/consumer.route";
import retailerRoutes from "./routes/retailer.route";

const app = express();
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);

app.use("/api/consumers", consumerRoutes);
app.use("/api/retailers", retailerRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.statusCode ?? 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
});

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
})();
