import { describe, it, expect, vi } from 'vitest';

// Mock getTavilyClient
vi.mock('../tavily', () => ({
  getTavilyClient: vi.fn(() => ({
    search: vi.fn().mockResolvedValue({
      answer: 'This is a test answer',
      results: [
        { title: 'Test Result', url: 'https://test.com', content: 'Test content' }
      ]
    }),
  })),
}));

import { webSearchTool } from './search';

describe('WebSearch Tool', () => {
  it('should have correct description and parameters', () => {
    expect(webSearchTool.description).toBeDefined();
    expect(webSearchTool.parameters).toBeDefined();
  });

  it('should execute search correctly', async () => {
    const result = await (webSearchTool as any).execute({ query: 'test query' });
    const parsed = JSON.parse(result);
    expect(parsed.answer).toBe('This is a test answer');
    expect(parsed.results[0].title).toBe('Test Result');
  });
});
