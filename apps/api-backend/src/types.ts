import { t } from "elysia";

//api backend is the primary backend to stream backend responses from the chat

export const Messages = t.Array(
  t.Object({
    role: t.Enum({
      user: "user",
      assistant: "assistant",
    }),
    content: t.String(),
  }),
);

export type Messages = typeof Messages.static;

export const Conversation = t.Object({
  model: t.String(),
  messages: Messages,
});
