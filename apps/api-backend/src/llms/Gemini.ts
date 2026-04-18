import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";
import { BaseLLM, LLMResponse } from "./Base";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export class Gemini extends BaseLLM {
  static async chat(model: string, messages: Message[]): Promise<LLMResponse> {
    const response = await client.models.generateContent({
      model: model,
      contents: messages.map((message: Message) => ({
        text: message.content,
        role: message.role,
      })),
    });

    return {
      outputTokensConsumed: response.usageMetadata?.candidatesTokenCount!,
      inputTokensConsumed: response.usageMetadata?.promptTokenCount!,
      completions: {
        choices: [
          {
            message: {
              content: response.text!,
            },
          },
        ],
      },
    };
  }
}
