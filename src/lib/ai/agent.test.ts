import { describe, it, expect, vi } from 'vitest';

// Mock registry and tools
vi.mock('./registry', () => ({
  getModel: vi.fn(() => ({})),
}));

vi.mock('./tools/search', () => ({
  webSearchTool: {},
}));

// Mock streamText
vi.mock('ai', async () => {
  const actual = await vi.importActual('ai');
  return {
    ...actual as any,
    streamText: vi.fn().mockReturnValue({}),
  };
});

import { runAgent } from './agent';

describe('Agent Logic', () => {
  it('should call streamText with correct parameters', async () => {
    const { streamText } = await import('ai');
    
    await runAgent({
      messages: [{ role: 'user', content: 'hello' }],
      selection: { provider: 'google', modelId: 'gemini-1.5-flash' }
    });

    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: expect.anything(),
      messages: expect.any(Array),
      tools: expect.anything(),
      maxSteps: expect.any(Number),
    }));
  });
});
