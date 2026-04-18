import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth";
import { apiKeysRouter } from "./modules/apiKeys";
import { modelsRouter } from "./modules/models";
import { paymentsRouter } from "./modules/payments";

export type App = express.Application;

const PRIMARY_BACKEND_PORT = 3000;

export const app = express();

app.use(
  cors({
    origin: `http://localhost:${PRIMARY_BACKEND_PORT}`,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api-keys", apiKeysRouter);
app.use("/models", modelsRouter);
app.use("/payments", paymentsRouter);

app.listen(PRIMARY_BACKEND_PORT, () => {
  console.log(`Server is running on port ${PRIMARY_BACKEND_PORT}`);
});
