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
    { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { id: 'gemini-2.0-pro-exp', label: 'Gemini 2.0 Pro Exp' },
  ],
  openrouter: [
    { id: 'openai/gpt-4o', label: 'GPT-4o' },
    { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { id: 'google/gemini-2.0-flash-lite:free', label: 'Gemini 2.0 Flash Lite (Free)' },
    { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
  ],
};
