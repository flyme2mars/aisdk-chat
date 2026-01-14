import { streamText, type CoreMessage } from 'ai';
import { getModel, type ModelSelection } from './registry';
import { webSearchTool } from './tools/search';

export interface AgentOptions {
  messages: CoreMessage[];
  selection: ModelSelection;
}

export function runAgent({ messages, selection }: AgentOptions) {
  const model = getModel(selection);

  console.log(`[Agent] Initializing stream with model: ${selection.modelId}`);

  return streamText({
    model,
    messages,
    tools: {
      webSearch: webSearchTool,
    },
    maxSteps: 5,
    onStepFinish: (event) => {
      console.log(`[Agent Step] Finished step. Tool calls: ${event.toolCalls.length}`);
      event.toolCalls.forEach(tc => {
        const args = (tc as any).args || (tc as any).input || {};
        console.log(`  - Tool: ${tc.toolName}, Args: ${JSON.stringify(args)}`);
      });
      
      if (event.text) {
        console.log(`[Agent Step] Generated text length: ${event.text.length}`);
      }
    },
    onFinish: (event) => {
      console.log(`[Agent] Final finish reason: ${event.finishReason}`);
    },
    system: `You are a helpful and robust AI assistant. 
    You have access to tools like "webSearch". 
    If a user's request requires real-time information, latest news, or details you are unsure about, you MUST call the webSearch tool.
    When calling webSearch, you MUST provide a "query" argument.
    Once you get the search results, summarize them and provide a detailed answer.
    DO NOT just return the search results. Write a natural response.`,
  });
}
