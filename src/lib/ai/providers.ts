import { createOpenAI, type OpenAIProvider } from '@ai-sdk/openai';
import { createGoogleGenerativeAI, type GoogleGenerativeAIProvider } from '@ai-sdk/google';

let openrouterInstance: OpenAIProvider | null = null;
let googleInstance: GoogleGenerativeAIProvider | null = null;

// OpenRouter Provider (OpenAI Compatible)
export function getOpenRouter() {
  if (!openrouterInstance) {
    openrouterInstance = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return openrouterInstance;
}

// Google Gemini Provider
export function getGoogle() {
  if (!googleInstance) {
    googleInstance = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
  }
  return googleInstance;
}

// Default models
export const DEFAULT_MODELS = {
  openrouter: 'openai/gpt-4o-mini',
  google: 'gemini-1.5-flash',
};