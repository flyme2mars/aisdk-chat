import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response('Missing OPENROUTER_API_KEY', { status: 401 });
  }

  const openai = createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': 'http://localhost:3000', // Optional: required for some OpenRouter free tier usage analytics
      'X-Title': 'Next.js AI Chat', // Optional
    },
  });

  // Use the specific model requested
  const modelName = 'xiaomi/mimo-v2-flash:free';

  console.log(`[API] Received ${messages.length} messages. Last message: ${messages[messages.length - 1]?.content?.substring(0, 50) || 'no content'}...`);

  const coreMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai.chat(modelName),
    messages: coreMessages,
    maxSteps: 5,
    system: 'You are a search expert. When a user asks a question, your FIRST action must be to call the webSearch tool. Do not explain yourself first. Once you have results, provide a detailed answer.',
    onFinish: (event: any) => {
      console.log('[API] Stream finished. Reason:', event.finishReason);
    },
    tools: {
      webSearch: tool({
        description: 'Search the web for information',
        parameters: z.object({
          query: z.string().describe('The search query to execute'),
        }),
        execute: async ({ query }: { query: string }) => {
          console.log(`[API] webSearch tool executed with query: "${query}"`);
          const apiKey = process.env.TAVILY_API_KEY;
          
          if (!apiKey) {
            return `[System Note: Search functionality requires TAVILY_API_KEY. Mock result for "${query}": The world's largest bird statue is the Jatayu Earth's Center in Kerala, India.]`;
          }

          try {
            const response = await fetch('https://api.tavily.com/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic' }),
            });
            const data = await response.json();
            return JSON.stringify(data);
          } catch (error) {
            return `Error performing search: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        },
      } as any) as any,
    },
  } as any);

  return result.toUIMessageStreamResponse();
}
