import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { app as authApp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apiKeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

export type App = typeof app;

const PRIMARY_BACKEND_PORT = process.env.PRIMARY_BACKEND_PORT;

/**
 * auth => signup ,signin
 * api-key => create the API key, get API key, delete API key, disable API key
 * model => get all the supported models, their pricing , providers etc.
 * payment => onramp/offramp endpoints for stripe integration
 */

export const app = new Elysia()
  .use(authApp)
  .use(apiKeyApp)
  .use(modelsApp)
  .use(paymentsApp);

app
  .use(
    cors({
      origin: `http://localhost:${PRIMARY_BACKEND_PORT}`,
      credentials: true,
    }),
  )
  .listen(3000);
