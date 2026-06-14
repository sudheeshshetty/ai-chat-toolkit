import type { EmbedTextFn, OpenAIEmbeddingsConfig } from "../types.js";

const DEFAULT_MODEL = "text-embedding-3-small";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

interface OpenAIEmbeddingsResponse {
  data?: Array<{ embedding?: number[] }>;
  error?: { message?: string };
}

export function createOpenAIEmbedder(
  config: OpenAIEmbeddingsConfig,
): EmbedTextFn {
  const apiKey = config.apiKey?.trim();
  if (!apiKey) {
    throw new Error("OpenAI embeddings require an apiKey.");
  }

  const model = config.model ?? DEFAULT_MODEL;
  const baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");

  return async (text: string): Promise<number[]> => {
    const response = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: text,
      }),
    });

    const payload = (await response.json()) as OpenAIEmbeddingsResponse;

    if (!response.ok) {
      const message =
        payload.error?.message ??
        `OpenAI embeddings request failed with status ${response.status}.`;
      throw new Error(message);
    }

    const embedding = payload.data?.[0]?.embedding;
    if (!embedding || embedding.length === 0) {
      throw new Error("OpenAI embeddings response did not include an embedding.");
    }

    return embedding;
  };
}
