import { streamText, type CoreMessage } from 'ai';
import { getModel, type ModelSelection } from './registry';
import { webSearchTool } from './tools/search';

export interface AgentOptions {
  messages: CoreMessage[];
  selection: ModelSelection;
}

export function runAgent({ messages, selection }: AgentOptions) {
  const model = getModel(selection);

  return streamText({
    model,
    messages,
    tools: {
      webSearch: webSearchTool,
    },
    // maxSteps enables recursive tool calling
    maxSteps: 5,
    system: `You are a helpful and robust AI assistant. 
    If a user's request requires real-time information, latest news, or details you are unsure about, use the webSearch tool.
    Always provide high-quality, accurate responses based on the available information.`,
  });
}
