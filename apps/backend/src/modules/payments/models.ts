import { t } from "elysia";

export namespace PaymentsModel {
  export const onrampSuccessResponseSchema = t.Object({
    message: t.Literal("Successfully onramped !"),
    credits: t.Number(),
  });

  export type onrampResponseSchema = typeof onrampSuccessResponseSchema.static;

  export const onrampFailedResponseSchema = t.Object({
    message: t.Literal("Onramp Failed!"),
    credits: t.Number(),
  });

  export type onrampFailedResponseSchema =
    typeof onrampFailedResponseSchema.static;
}
