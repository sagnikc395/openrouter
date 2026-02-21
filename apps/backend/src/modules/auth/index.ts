import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
export const app = new Elysia({ prefix: "auth" })
  .post(
    "/signup",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(body.email, body.password);
        return {
          id: userId,
        };
      } catch (e) {
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      body: AuthModel.signupSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponseSchema,
      },
    },
  )
  .post(
    "/signin",
    async ({ body }) => {
      const token = await AuthService.signin(body.email, body.password);
      return {
        token,
      };
    },
    {
      body: AuthModel.signinSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        403: AuthModel.signinFailureSchema,
      },
    },
  );
