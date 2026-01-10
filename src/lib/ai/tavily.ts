import { tavily, type TavilyClient } from '@tavily/core';

let client: TavilyClient | null = null;

export function getTavilyClient() {
  if (!client) {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY is not defined in environment variables');
    }
    client = tavily({ apiKey });
  }
  return client;
}