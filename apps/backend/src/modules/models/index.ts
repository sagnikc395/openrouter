import { Router, Request, Response } from "express";
import { ModelsService } from "./service";

export const modelsRouter = Router();

modelsRouter.get("/", async (req: Request, res: Response) => {
  const models = await ModelsService.getModels();
  res.json({ models });
});

modelsRouter.get("/:id/providers", async (req: Request, res: Response) => {
  const providers = await ModelsService.getModelProviders(
    Number(req.params.id),
  );
  res.json({ providers });
});
