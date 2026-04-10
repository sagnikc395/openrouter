import { Request, Response } from "express";
import {
  createApiKeySchema,
  disableApiKeySchema,
  deleteApiKeySchema,
} from "./schema";
import { ApiKeyService } from "./service";

export const ApiKeyController = {
  async create(req: Request, res: Response): Promise<void> {
    const parsed = createApiKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    const apiKey = await ApiKeyService.create(req.userId!, parsed.data.name);
    res.status(201).json(apiKey);
  },

  async list(req: Request, res: Response): Promise<void> {
    const apiKeys = await ApiKeyService.list(req.userId!);
    res.status(200).json(apiKeys);
  },

  async disable(req: Request, res: Response): Promise<void> {
    const parsed = disableApiKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    await ApiKeyService.disable(req.userId!, parsed.data.keyId);
    res.status(200).json({ message: "API key disabled" });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const parsed = deleteApiKeySchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    await ApiKeyService.remove(req.userId!, parsed.data.keyId);
    res.status(200).json({ message: "API key deleted" });
  },
};
