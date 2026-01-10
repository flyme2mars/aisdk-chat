import { tool } from 'ai';
import { z } from 'zod';
import { getTavilyClient } from '../tavily';

export const webSearchTool = tool({
  description: 'Search the web for information using Tavily API. Use this for real-time information or when your knowledge base is insufficient.',
  parameters: z.object({
    query: z.string().describe('The search query to execute'),
  }),
  execute: async ({ query }) => {
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
