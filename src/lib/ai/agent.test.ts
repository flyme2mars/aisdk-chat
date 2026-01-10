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
  it('should call getModel and streamText with correct parameters', async () => {
    const { streamText } = await import('ai');
    const { getModel } = await import('./registry');
    
    const selection = { provider: 'google', modelId: 'gemini-1.5-flash' } as const;
    await runAgent({
      messages: [{ role: 'user', content: 'hello' }],
      selection
    });

    expect(getModel).toHaveBeenCalledWith(selection);
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: expect.anything(),
      messages: expect.any(Array),
      tools: expect.anything(),
      maxSteps: 5,
    }));
  });
});
