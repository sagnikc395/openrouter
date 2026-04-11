import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { app as authApp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apiKeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

export type App = typeof app;

export const app = new Elysia()
  .use(authApp)
  .use(apiKeyApp)
  .use(modelsApp)
  .use(paymentsApp);

app
  .use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    }),
  )
  .listen(3000);
