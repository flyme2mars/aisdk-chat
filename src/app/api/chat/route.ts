import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

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

  // Manual conversion to ensure compatibility with models that might not support array content fully via this provider
  const coreMessages = messages.map((m: any) => {
    let content = '';
    if (Array.isArray(m.parts)) {
      content = m.parts.map((p: any) => {
        if (p.type === 'text') return p.text;
        return '';
      }).join('');
    } else if (typeof m.content === 'string') {
      content = m.content;
    }

    return {
      role: m.role,
      content,
    };
  });

  const result = streamText({
    model: openai(modelName),
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
