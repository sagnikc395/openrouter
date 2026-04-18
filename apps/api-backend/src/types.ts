import { z } from "zod";

export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
  model: z.string(),
  messages: z.array(MessageSchema),
});

export type Conversation = z.infer<typeof ConversationSchema>;
