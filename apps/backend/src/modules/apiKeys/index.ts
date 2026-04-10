import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { ApiKeyController } from "./controller";

export const apiKeysRouter = Router();

apiKeysRouter.use(requireAuth);

apiKeysRouter.post("/", ApiKeyController.create);
apiKeysRouter.get("/", ApiKeyController.list);
apiKeysRouter.post("/disable", ApiKeyController.disable);
apiKeysRouter.delete("/", ApiKeyController.remove);