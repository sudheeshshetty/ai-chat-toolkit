export { rag } from "./rag.js";
export type { RagPlugin } from "./rag.js";
export {
  chunkDocument,
  chunkDocuments,
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  resolveChunkingConfig,
} from "./chunking/chunkText.js";
export { createEmbedder } from "./embeddings/createEmbedder.js";
export { createOpenAIEmbedder } from "./embeddings/openaiEmbeddings.js";
export { formatSearchResultsAsContext } from "./context/formatSearchResults.js";
export { indexDocuments } from "./orchestration/indexDocuments.js";
export { retrieveContext } from "./orchestration/retrieveContext.js";
export type {
  CustomEmbeddingsConfig,
  EmbedTextFn,
  OpenAIEmbeddingsConfig,
  RagChunk,
  RagChunkingConfig,
  RagChunkWithEmbedding,
  RagDocument,
  RagEmbeddingsConfig,
  RagOptions,
  RagSearchConfig,
  RagSearchOptions,
  RagSearchResult,
  RagSource,
  RagStore,
} from "./types.js";
