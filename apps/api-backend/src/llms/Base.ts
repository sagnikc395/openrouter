import { Message } from "../types";

export type LLMResponse = {
  completions: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
  inputTokensConsumed: number;
  outputTokensConsumed: number;
};

export class BaseLLM {
  static async chat(model: string, messages: Message[]): Promise<LLMResponse> {
    throw new Error(`Not yet implemented chat function!`);
  }
}
