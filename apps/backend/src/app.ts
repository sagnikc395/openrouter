import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth";
import { apiKeysRouter } from "./modules/apiKeys";
import { modelsRouter } from "./modules/models";
import { paymentsRouter } from "./modules/payments";

export function createPrimaryBackendApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/api-keys", apiKeysRouter);
  app.use("/models", modelsRouter);
  app.use("/payments", paymentsRouter);

  return app;
}
