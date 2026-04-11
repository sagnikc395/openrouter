import Elysia from "elysia";

export const app = new Elysia()
  .use(authApp)
  .use(apiKeyApp)
  .use(modelsApp)
  .use(paymentsApp);

export type App = typeof app;
