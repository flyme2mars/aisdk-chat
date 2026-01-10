import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the providers and tavily before importing registry
vi.mock('./providers', () => ({
  google: vi.fn((id: string) => ({ modelId: id, provider: 'google' })),
  openrouter: vi.fn((id: string) => ({ modelId: id, provider: 'openrouter' })),
  DEFAULT_MODELS: {
    openrouter: 'openai/gpt-4o-mini',
    google: 'gemini-1.5-flash',
  },
}));

vi.mock('./tavily', () => ({
  tavilyClient: {
    search: vi.fn(),
  },
}));

import { validateEnv, getModel, AVAILABLE_MODELS } from './index';

describe('AI Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should throw an error if environment variables are missing', () => {
    delete process.env.OPENROUTER_API_KEY;
    expect(() => validateEnv()).toThrow(/Missing environment variables/);
  });

  it('should not throw if all environment variables are present', () => {
    process.env.OPENROUTER_API_KEY = 'test';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test';
    process.env.TAVILY_API_KEY = 'test';
    expect(() => validateEnv()).not.toThrow();
  });
});

describe('ProviderRegistry', () => {
  it('should return a google model for google provider', () => {
    const model = getModel({ provider: 'google', modelId: 'gemini-1.5-flash' });
    expect(model).toBeDefined();
    expect(model.modelId).toBe('gemini-1.5-flash');
  });

  it('should return an openrouter model for openrouter provider', () => {
    const model = getModel({ provider: 'openrouter', modelId: 'openai/gpt-4o-mini' });
    expect(model).toBeDefined();
    // For OpenAI compatible providers, modelId might be different internally depending on how createOpenAI is used
    expect(model.modelId).toBe('openai/gpt-4o-mini');
  });

  it('should throw for unsupported provider', () => {
    // @ts-expect-error - testing invalid provider
    expect(() => getModel({ provider: 'invalid', modelId: 'test' })).toThrow(/Unsupported provider/);
  });

  it('should have available models defined', () => {
    expect(AVAILABLE_MODELS.google.length).toBeGreaterThan(0);
    expect(AVAILABLE_MODELS.openrouter.length).toBeGreaterThan(0);
  });
});
