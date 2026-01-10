export * from './providers';
export * from './tavily';
export * from './registry';
export * from './agent';

export function validateEnv() {
  const required = [
    'OPENROUTER_API_KEY',
    'GOOGLE_GENERATIVE_AI_API_KEY',
    'TAVILY_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}. Please check your .env.local file.`
    );
  }
}
