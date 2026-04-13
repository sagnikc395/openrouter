import { Cookie, Elysia } from "elysia";
import { AuthModel } from "./models";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

// route creation file
export const app = new Elysia({ prefix: "auth" })
  // add the jwt middleware
  .use(
    jwt({
      name: "jwt", //repersents how we will get access from jwt instance
      secret: process.env.JWT_SECRET!,
    }),
  )
  //signup logic
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        const userId = await AuthService.signup(body.email, body.password);
        return {
          id: userId,
        };
      } catch (e) {
        console.log(e);
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      // return responses with the given schema
      // one with a success and one with a failure
      body: AuthModel.signupSchema,
      response: {
        200: AuthModel.signupResponseSchema,
        400: AuthModel.signupFailedResponseSchema,
      },
    },
  )
  //signin logic
  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { correctCredentials, userId } = await AuthService.signin(
        body.email,
        body.password,
      );
      if (correctCredentials && userId) {
        const token = await jwt.sign({ userId });
        if (!auth) {
          auth = new Cookie("auth", {});
        }

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 7 * 86400,
        });

        return {
          message: "Signed in successfully",
        };
      } else {
        return status(403, {
          message: "Incorrect credentials",
        });
      }
    },
    {
      body: AuthModel.signinSchema,
      response: {
        200: AuthModel.signinResponseSchema,
        403: AuthModel.signinFailureSchema,
      },
    },
  )
  .use(
    new Elysia()
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET!,
        }),
      )
      .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) {
          return status(401);
        }

        const decoded = await jwt.verify(auth.value as string);

        if (!decoded || !decoded.userId) {
          return status(401);
        }

        return {
          userId: decoded.userId as string,
        };
      })
      .get(
        "/profile",
        async ({ userId, status }) => {
          const userData = await AuthService.getUserDetails(Number(userId));
          if (!userData) {
            return status(400, {
              message: "Error while fetching user details",
            });
          }
          return userData;
        },
        {
          response: {
            200: AuthModel.profileResponseSchema,
            400: AuthModel.profileResponseErrorSchema,
          },
        },
      ),
  );
