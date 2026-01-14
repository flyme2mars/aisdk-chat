import { runAgent, validateEnv } from '@/lib/ai';
import { generateText } from 'ai';
import { getModel } from '@/lib/ai/registry';
import { webSearchTool } from '@/lib/ai/tools/search';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    validateEnv();
    const body = await req.json();
    const selection = body.selection || { provider: 'google', modelId: 'gemini-2.5-flash-lite' };
    const { messages } = body;

    if (!messages) return new Response('Missing messages', { status: 400 });

    console.log(`[API] Agent Manual Multi-Step for: ${selection.modelId}`);

    const model = getModel(selection);

    // Step 1: Generate response with tool calling (Non-streaming for the "thinking" part)
    const firstStep = await generateText({
      model,
      messages,
      tools: { webSearch: webSearchTool },
      maxSteps: 5, // Handles the recursive search internally
      system: `You are a helpful AI assistant with web search capabilities.
      If you use a tool, use the information gathered to provide a final answer.`,
    });

    console.log(`[API] Agent finished thinking. Steps taken: ${firstStep.steps.length}`);

    // Step 2: Stream the final result to the UI
    // We provide the full history including the tool calls and results from the firstStep
    const result = runAgent({
      messages: [...messages, ...firstStep.response.messages],
      selection,
    });

    return (result as any).toTextStreamResponse();
  } catch (error: any) {
    console.error('[API Error]:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
