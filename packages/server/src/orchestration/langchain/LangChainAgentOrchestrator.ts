import { createAgent } from "langchain";
import type { LLMProvider } from "../../providers/LLMProvider.js";
import type { ToolRegistry } from "../../tool-registry/ToolRegistry.js";
import type { ChatMessage, ToolExecutionContext } from "../../types.js";
import { resolveOrchestrationSystemPrompt } from "../defaultOrchestrationPrompt.js";
import { aiToolsToLangChainTools } from "./aiToolToLangChainTool.js";
import { LLMProviderChatModel } from "./LLMProviderChatModel.js";
import {
  chatHistoryToLangChainMessages,
  extractFinalAssistantText,
} from "./messageConversion.js";

export interface LangChainAgentOrchestratorOptions {
  provider: LLMProvider;
  toolRegistry: ToolRegistry;
  systemPrompt?: string;
  maxToolRounds: number;
}

export class LangChainAgentOrchestrator {
  readonly #provider: LLMProvider;
  readonly #toolRegistry: ToolRegistry;
  readonly #systemPrompt?: string;
  readonly #maxToolRounds: number;

  constructor(options: LangChainAgentOrchestratorOptions) {
    this.#provider = options.provider;
    this.#toolRegistry = options.toolRegistry;
    this.#systemPrompt = options.systemPrompt;
    this.#maxToolRounds = options.maxToolRounds;
  }

  async run(input: {
    history: ChatMessage[];
    userMessage: string;
    context: ToolExecutionContext;
  }): Promise<string> {
    const aiTools = this.#toolRegistry.getAll();
    const langChainTools = aiToolsToLangChainTools(
      aiTools,
      this.#toolRegistry,
      input.context,
    );

    const model = new LLMProviderChatModel({
      provider: this.#provider,
      aiTools,
    });

    const agent = createAgent({
      model,
      tools: langChainTools,
      systemPrompt: resolveOrchestrationSystemPrompt(this.#systemPrompt),
    });

    const messages = chatHistoryToLangChainMessages(
      input.history,
      input.userMessage,
    );

    const result = await agent.invoke(
      { messages },
      { recursionLimit: this.#maxToolRounds },
    );

    const resultMessages = result.messages as Parameters<
      typeof extractFinalAssistantText
    >[0];

    return extractFinalAssistantText(resultMessages);
  }
}
