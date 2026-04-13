import { t } from "elysia";

export namespace AuthModel {
  // model for signin
  export const signinSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  //can also export the type of the signinSchema for using it for maximum type safety on the client side
  export type signInSchema = typeof signinSchema.static;

  export const signinResponseSchema = t.Object({
    message: t.Literal("Signed in successfully"),
  });

  export type signinResponseSchema = typeof signinResponseSchema.static;

  export const signinFailureSchema = t.Object({
    message: t.Literal("Incorrect credentials"),
  });

  export type signinFailureSchema = typeof signinFailureSchema.static;

  //model for signup

  export const signupSchema = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type signupSchema = typeof signinSchema.static;

  export const signupResponseSchema = t.Object({
    id: t.String(),
  });

  export const signupFailedResponseSchema = t.Object({
    message: t.Literal("Error while signing up"),
  });

  export type signupResponseSchema = typeof signinResponseSchema.static;
  export type signupFailedResponseSchema = typeof signupFailedResponseSchema;

  export const profileResponseSchema = t.Object({
    credits: t.Number(),
  });

  export const profileResponseErrorSchema = t.Object({
    message: t.Literal("Error while fetching user details"),
  });
}
