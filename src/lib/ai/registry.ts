import { getGoogle, getOpenRouter } from './providers';
import { LanguageModelV1 } from 'ai';

export type AIProvider = 'google' | 'openrouter';

export interface ModelSelection {
  provider: AIProvider;
  modelId: string;
}

export const PROVIDERS: AIProvider[] = ['google', 'openrouter'];

export function getModel(selection: ModelSelection): LanguageModelV1 {
  switch (selection.provider) {
    case 'google':
      return getGoogle()(selection.modelId);
    case 'openrouter':
      return getOpenRouter()(selection.modelId);
    default:
      const _exhaustiveCheck: never = selection.provider;
      throw new Error(`Unsupported provider: ${selection.provider}`);
  }
}

export const AVAILABLE_MODELS: Record<AIProvider, { id: string; label: string }[]> = {
  google: [
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ],
  openrouter: [
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
    { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { id: 'google/gemini-flash-1.5', label: 'Gemini Flash 1.5 (OpenRouter)' },
  ],
};