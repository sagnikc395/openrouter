import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth";
import { apiKeysRouter } from "./modules/apiKeys";

const app: Express = express();
const WEB_PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api-keys", apiKeysRouter);

app.listen(WEB_PORT, () => {
  console.log(`Server is running at http://localhost:${WEB_PORT}`);
});

/**
 * auth => signup , signin
 * api-key => create api key, get api key, delete api key, disable api key
 * model => get all the supported models, their pricing , providers etc.
 *
 */
