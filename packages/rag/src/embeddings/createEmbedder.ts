import { createOpenAIEmbedder } from "./openaiEmbeddings.js";
import type { EmbedTextFn, RagEmbeddingsConfig } from "../types.js";

export function createEmbedder(config: RagEmbeddingsConfig): EmbedTextFn {
  if (config.provider === "openai") {
    return createOpenAIEmbedder(config);
  }

  if (typeof config.embed === "function") {
    return config.embed;
  }

  throw new Error(
    "Invalid embeddings config: provide provider \"openai\" or a custom embed function.",
  );
}
