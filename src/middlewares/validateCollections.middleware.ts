import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateZod(schema: ZodSchema<any>, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const raw = source === "body" ? req.body : source === "query" ? req.query : req.params;
      const parsed = schema.parse(raw);
      if (source === "body") req.body = parsed;
      if (source === "query") req.query = parsed as any;
      if (source === "params") req.params = parsed as any;
      return next();
    } catch (err: any) {
      const message = err?.errors ? err.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("; ") : err.message;
      return res.status(400).json({ success: false, message });
    }
  };
}