import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages, generateText } from 'ai';
import { z } from 'zod';
import { tavily } from '@tavily/core';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(`[API] Received ${messages.length} messages.`);

  // 1. Sanitize incoming messages (Flatten user text for Google)
  const sanitizeForGoogle = (msgs: any[]) => {
    return msgs.map(m => {
      if (m.role === 'user' && Array.isArray(m.content)) {
        const textContent = m.content
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
        return { ...m, content: textContent };
      }
      return m;
    });
  };

  const initialMessages = sanitizeForGoogle(messages);
  const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

  // Tool definition
  const webSearchTool = tool({
    description: 'Search the web for information',
    parameters: z.object({
      query: z.string().describe('The search query to execute'),
    }),
    execute: async (args: any) => {
      console.log(`[API] Raw tool args:`, JSON.stringify(args));
      let query = args.query || args.q || args.input || args.topic || args.search_query;
      if (!query && args.queries) query = Array.isArray(args.queries) ? args.queries[0] : args.queries;
      if (!query && typeof args === 'string') query = args;

      console.log(`[API] webSearch tool extracted query: "${query}"`);
      
      try {
        if (!query) throw new Error('No query extracted');
        const response = await tvly.search(query, {
          search_depth: 'advanced',
          max_results: 5,
          include_answer: true
        });
        console.log(`[API] Search success. Found ${response.results.length} results.`);
        return JSON.stringify({
          answer: response.answer,
          results: response.results.map((r: any) => ({
            title: r.title,
            url: r.url,
            content: r.content?.substring(0, 300)
          }))
        });
      } catch (error) {
        console.error('[API] Search error:', error);
        return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    },
  } as any);

  // Step 1: Check intent with generateText
  const firstStep = await generateText({
    model: google('gemini-2.5-flash-lite'),
    messages: initialMessages,
    tools: { webSearch: webSearchTool },
    toolChoice: 'auto',
    system: 'You are a search expert. If the user asks a question requiring external knowledge, call the webSearch tool immediately.',
  });

  const toolCalls = firstStep.toolCalls;

  if (toolCalls.length > 0) {
    console.log(`[API] Model requested ${toolCalls.length} tool calls.`);
    
    // Construct Assistant Message with Tool Calls (Strict CoreMessage format)
    const assistantMsg = {
      role: 'assistant',
      content: toolCalls.map(tc => {
        const args = (tc as any).args || (tc as any).input || {};
        return {
          type: 'tool-call',
          toolCallId: tc.toolCallId,
          toolName: tc.toolName,
          args: args,
        };
      }),
    };

    // Execute Tools
    const toolResults = await Promise.all(toolCalls.map(async (tc) => {
        console.log('[API] Processing Tool Call:', JSON.stringify(tc));
        const args = (tc as any).args || (tc as any).input || {};
        const result = await (webSearchTool as any).execute(args, { toolCallId: tc.toolCallId, messages: initialMessages });
        return {
            type: 'tool-result',
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            result: result, 
        };
    }));

    const toolMsg = { role: 'tool', content: toolResults };

    // Update History & Sanitize again (just in case)
    const finalHistory = sanitizeForGoogle([...initialMessages, assistantMsg, toolMsg] as any[]);
    
    console.log(`[API] Streaming final answer.`);

    // Step 2: Stream Final Answer
    const result = streamText({
        model: google('gemini-2.5-flash-lite'),
        messages: finalHistory,
        system: 'You are a helpful assistant. Provide a detailed answer based on the search results.',
    });
    
    return result.toUIMessageStreamResponse();
  }

  // If no tool call, just stream the response
  console.log(`[API] No tool call. Streaming standard response.`);
  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    messages: initialMessages,
    system: 'You are a helpful assistant.',
  });

  return result.toUIMessageStreamResponse();
}
