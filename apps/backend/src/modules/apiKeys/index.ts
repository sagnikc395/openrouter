import { Router, Request, Response } from "express";
import { ApiKeyModel } from "./models";
import { ApiKeyService } from "./service";
import {
  authenticateToken,
  AuthRequest,
} from "../../middleware/authMiddleware";

export const apiKeysRouter = Router();

apiKeysRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const body = req.body as ApiKeyModel.CreateApiKeySchema;
    const { apiKey, id } = await ApiKeyService.createApiKey(
      body.name,
      Number(req.userId),
    );
    res.json({ id, apiKey });
  },
);

apiKeysRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const apiKeys = await ApiKeyService.getApiKeys(Number(req.userId));
    res.json({ apiKeys });
  },
);

apiKeysRouter.put(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const body = req.body as ApiKeyModel.UpdateApiKeySchema;
    try {
      await ApiKeyService.updateApiKeyDisabled(
        Number(body.id),
        Number(req.userId),
        body.disabled,
      );
      res.json({ message: "Updated api key successfully" });
    } catch {
      res.status(411).json({ message: "Updating api key unsuccessful" });
    }
  },
);

apiKeysRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      await ApiKeyService.delete(Number(req.params.id), Number(req.userId));
      res.json({ message: "Api key deleted successfully" });
    } catch {
      res.status(411).json({ message: "Api key deletetion failed" });
    }
  },
);
