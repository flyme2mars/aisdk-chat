import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// OpenRouter Provider (OpenAI Compatible)
export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Google Gemini Provider
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Default models
export const DEFAULT_MODELS = {
  openrouter: 'openai/gpt-4o-mini',
  google: 'gemini-1.5-flash',
};
