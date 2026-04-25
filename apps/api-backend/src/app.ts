import express from "express";
import cors from "cors";
import { z } from "zod";
import { prisma } from "db";
import { MessageSchema } from "./types";
import { Openai } from "./llms/OpenAI";
import { Claude } from "./llms/Claude";
import { Gemini } from "./llms/Gemini";

const CompletionsRequestSchema = z.object({
  model: z.string(),
  messages: z.array(MessageSchema),
  apiKey: z.string(),
});

export function createApiBackendApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.post("/completions", async (req, res) => {
    try {
      const body = CompletionsRequestSchema.parse(req.body);

      const apiKeyData = await prisma.apiKey.findFirst({
        where: {
          apiKey: body.apiKey,
          deleted: false,
          disabled: false,
        },
        include: {
          user: true,
        },
      });

      if (!apiKeyData) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      const modelProviderMapping = await prisma.modelProviderMapping.findFirst({
        where: {
          model: {
            slug: body.model,
          },
        },
        include: {
          provider: true,
        },
      });

      if (!modelProviderMapping) {
        return res.status(400).json({ error: "Model not found" });
      }

      const inputCost = modelProviderMapping.inputTokenCost;
      const outputCost = modelProviderMapping.outputTokenCost;

      let response;
      const providerName = modelProviderMapping.provider.name.toLowerCase();

      if (providerName === "openai") {
        response = await Openai.chat(body.model, body.messages);
      } else if (providerName === "google" || providerName === "gemini") {
        response = await Gemini.chat(body.model, body.messages);
      } else if (providerName === "anthropic") {
        response = await Claude.chat(body.model, body.messages);
      } else {
        response = await Openai.chat(body.model, body.messages);
      }

      const totalInputCost =
        (response.inputTokensConsumed * inputCost) / 1_000_000;
      const totalOutputCost =
        (response.outputTokensConsumed * outputCost) / 1_000_000;
      const totalCost = Math.round((totalInputCost + totalOutputCost) * 100);

      if (apiKeyData.user.credits < totalCost) {
        return res.status(402).json({ error: "Insufficient credits" });
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: apiKeyData.user.id },
          data: {
            credits: apiKeyData.user.credits - totalCost,
          },
        }),
        prisma.apiKey.update({
          where: { id: apiKeyData.id },
          data: {
            creditsConsumed: apiKeyData.creditsConsumed + totalCost,
            lastUsed: new Date(),
          },
        }),
        prisma.conversation.create({
          data: {
            userId: apiKeyData.userId,
            apiKeyId: apiKeyData.id,
            modelProviderMappingId: modelProviderMapping.id,
            input: JSON.stringify(body.messages),
            output: JSON.stringify(response.completions),
            inputTokenCount: response.inputTokensConsumed,
            outputTokenCount: response.outputTokensConsumed,
          },
        }),
      ]);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const content = response.completions.choices[0]?.message.content || "";

      for (let i = 0; i < content.length; i++) {
        res.write(`data: ${JSON.stringify({ content: content[i] })}\n\n`);
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}
