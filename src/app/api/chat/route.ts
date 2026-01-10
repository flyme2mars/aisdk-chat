import { runAgent, validateEnv } from '@/lib/ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Validate environment variables
    validateEnv();

    // 2. Parse request
    const { messages, selection } = await req.json();

    if (!messages || !selection) {
      return new Response('Missing messages or selection', { status: 400 });
    }

    console.log(`[API] Agent request for provider: ${selection.provider}, model: ${selection.modelId}`);

    // 3. Run the agent
    const result = runAgent({
      messages,
      selection,
    });

    // 4. Return the stream response
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('[API Error]:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An internal error occurred' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}