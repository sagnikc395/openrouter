import Elysia from "elysia";
import { ModelsService } from "./service";
import { ModelsModel } from "./models";

export const app = new Elysia({ prefix: "models" })
  .get(
    "/",
    async () => {
      const models = await ModelsService.getModels();
      return {
        models,
      };
    },
    {
      response: {
        200: ModelsModel.getModelsResponseSchema,
      },
    },
  )
  .get(
    "/:id/providers",
    async ({ params: { id } }) => {
      const providers = await ModelsService.getModelProviders(Number(id));
      return {
        providers,
      };
    },
    {
      response: {
        200: ModelsModel.getModelProvidersResponseSchema,
      },
    },
  );
