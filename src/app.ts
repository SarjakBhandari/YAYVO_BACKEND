import express from "express";
import {CORS_DOMAIN_FIRST, CORS_DOMAIN_SECOND } from "./config";
import authRoutes from "./routes/auth.route";
import consumerRoutes from "./routes/consumer.route";
import retailerRoutes from "./routes/retailer.route";
import adminRoutes from "./routes/admin.routes";
import productRouter from './routes/product.routes';
import cors from 'cors';
import path from "path";

const app = express();
app.use(express.json());
// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

let corsOptions={
    origin:[CORS_DOMAIN_FIRST,CORS_DOMAIN_SECOND],
    //which domain can access your server
    //add frontend domain in origin
}
// orrigin : * . // allow all domain to access your backend serverr

app.use(cors(corsOptions));
// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/consumers", consumerRoutes);
app.use("/api/retailers", retailerRoutes);
app.use('/api/products', productRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.statusCode ?? 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
});

export default app;

