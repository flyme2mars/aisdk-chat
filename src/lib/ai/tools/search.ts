import { tool } from 'ai';
import { z } from 'zod';
import { getTavilyClient } from '../tavily';

export const webSearchTool = tool({
  description: 'Search the web for information using Tavily API. ALWAYS provide a "query" string parameter. Use this for real-time information or when your knowledge base is insufficient.',
  parameters: z.object({
    query: z.string().describe('The search query to execute. This is REQUIRED.'),
  }),
  execute: async (args) => {
    // Robust argument extraction
    const query = args.query;
    
    if (!query) {
      console.error('[Tool: WebSearch] No query provided in args:', args);
      return JSON.stringify({ error: 'No query provided. Please provide a search query.' });
    }

    console.log(`[Tool: WebSearch] Executing search for: "${query}"`);

    try {
      const client = getTavilyClient();
      const response = await client.search(query, {
        search_depth: 'advanced',
        max_results: 5,
        include_answer: true,
      });

      return JSON.stringify({
        answer: response.answer,
        results: response.results.map((r) => ({
          title: r.title,
          url: r.url,
          content: r.content?.substring(0, 500),
        })),
      });
    } catch (error) {
      console.error('[Tool: WebSearch] Error:', error);
      throw error;
    }
  },
});