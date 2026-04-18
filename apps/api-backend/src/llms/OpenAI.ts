import OpenAI from "openai";
import { BaseLLM, LLMResponse } from "./Base";
import { Message } from "../types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class Openai extends BaseLLM {
  static async chat(model: string, messages: Message[]): Promise<LLMResponse> {
    const response = await client.responses.create({
      model: model,
      input: messages.map((message: Message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return {
      inputTokensConsumed: response.usage?.input_tokens!,
      outputTokensConsumed: response.usage?.output_tokens!,
      completions: {
        choices: [
          {
            message: {
              content: response.output_text,
            },
          },
        ],
      },
    };
  }
}
