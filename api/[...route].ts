import express from "express";
import { createPrimaryBackendApp } from "../apps/backend/src/app";
import { createApiBackendApp } from "../apps/api-backend/src/app";

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", createPrimaryBackendApp());
app.use("/api", createApiBackendApp());

export default app;
