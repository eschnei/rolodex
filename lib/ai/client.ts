/**
 * Claude API Client
 *
 * Configures and exports the Anthropic client for use in AI processing.
 * Uses claude-3-haiku-20240307 for cost-effective, fast processing.
 */

import Anthropic from '@anthropic-ai/sdk';

// Default timeout for API calls (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Maximum retries for transient errors
const MAX_RETRIES = 3;

// Delay between retries (with exponential backoff)
const RETRY_DELAY_MS = 1000;

// Haiku model for cost-effective processing
export const AI_MODEL = 'claude-3-haiku-20240307';

// Context window for Haiku (in characters, ~3.5 chars per token)
export const CONTEXT_WINDOW_CHARS = 180000; // ~50k tokens worth

// Maximum output tokens
export const MAX_OUTPUT_TOKENS = 2048;

/**
 * Create and configure the Anthropic client
 */
function createAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to your .env.local file.'
    );
  }

  return new Anthropic({
    apiKey,
    timeout: DEFAULT_TIMEOUT,
    maxRetries: MAX_RETRIES,
  });
}

// Lazy singleton client
let clientInstance: Anthropic | null = null;

/**
 * Get the Anthropic client instance
 * Creates the client on first use (lazy initialization)
 */
export function getClient(): Anthropic {
  if (!clientInstance) {
    clientInstance = createAnthropicClient();
  }
  return clientInstance;
}

/**
 * Send a message to Claude with retry logic
 */
export async function sendMessage(
  systemPrompt: string,
  userMessage: string,
  options: {
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  const client = getClient();
  const maxTokens = options.maxTokens ?? MAX_OUTPUT_TOKENS;
  const temperature = options.temperature ?? 0;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: AI_MODEL,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      // Extract text from response
      const textContent = response.content.find((block) => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in AI response');
      }

      return textContent.text;
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const isRetryable = isRetryableError(error);

      if (!isRetryable || attempt === MAX_RETRIES - 1) {
        break;
      }

      // Exponential backoff
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError || new Error('Failed to get AI response');
}

/**
 * Check if an error is retryable (transient)
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIError) {
    // Rate limit or server errors are retryable
    return error.status === 429 || error.status >= 500;
  }
  // Network errors are typically retryable
  if (error instanceof Error) {
    return error.message.includes('timeout') ||
           error.message.includes('ECONNRESET') ||
           error.message.includes('network');
  }
  return false;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if the API key is configured
 */
export function isConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
