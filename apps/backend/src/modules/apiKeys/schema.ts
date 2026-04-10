import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(1),
});

export const disableApiKeySchema = z.object({
  keyId: z.number().int().positive(),
});

export const deleteApiKeySchema = z.object({
  keyId: z.number().int().positive(),
});

export type CreateApiKeyBody = z.infer<typeof createApiKeySchema>;
export type DisableApiKeyBody = z.infer<typeof disableApiKeySchema>;
export type DeleteApiKeyBody = z.infer<typeof deleteApiKeySchema>;
