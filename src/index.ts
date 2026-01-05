import express from "express";
import mongoose from "mongoose";
import { PORT, MONGODB_URI } from "./config";
import authRoutes from "./routes/auth.route";
import consumerRoutes from "./routes/consumer.route";
import retailerRoutes from "./routes/retailer.route";
import { connectDatabase } from "./database/mongodb";

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
async function startServer() {
    await connectDatabase();
    
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`)
});
}
startServer();