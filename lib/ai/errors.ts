/**
 * AI Processing Error Types and Utilities
 *
 * Provides structured error handling for AI processing operations.
 * Ensures notes always save even when AI processing fails.
 */

/**
 * Base class for AI-related errors
 */
export class AIError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;

  constructor(
    message: string,
    code: string,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.retryable = retryable;
  }
}

/**
 * Error when API key is not configured
 */
export class ConfigurationError extends AIError {
  constructor(message: string = 'AI processing is not configured') {
    super(message, 'CONFIG_ERROR', false);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error when rate limit is exceeded
 */
export class RateLimitError extends AIError {
  public readonly retryAfter: number | undefined;

  constructor(
    message: string = 'Rate limit exceeded. Please try again later.',
    retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT', true);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error when the API times out
 */
export class TimeoutError extends AIError {
  constructor(message: string = 'AI processing timed out. Please try again.') {
    super(message, 'TIMEOUT', true);
    this.name = 'TimeoutError';
  }
}

/**
 * Error when parsing AI response fails
 */
export class ParseError extends AIError {
  public readonly rawResponse: string | undefined;

  constructor(
    message: string = 'Failed to parse AI response',
    rawResponse?: string
  ) {
    super(message, 'PARSE_ERROR', true);
    this.name = 'ParseError';
    this.rawResponse = rawResponse;
  }
}

/**
 * Error when validation fails
 */
export class ValidationError extends AIError {
  public readonly validationErrors: string[];

  constructor(
    message: string = 'AI response validation failed',
    validationErrors: string[] = []
  ) {
    super(message, 'VALIDATION_ERROR', true);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Error for API errors (server-side issues)
 */
export class APIError extends AIError {
  public readonly status: number | undefined;

  constructor(
    message: string = 'AI service error',
    status?: number,
    retryable: boolean = true
  ) {
    super(message, 'API_ERROR', retryable);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * Error when context is too large
 */
export class ContextTooLargeError extends AIError {
  public readonly contextSize: number;
  public readonly maxSize: number;

  constructor(
    contextSize: number,
    maxSize: number,
    message: string = 'Content is too large to process'
  ) {
    super(message, 'CONTEXT_TOO_LARGE', false);
    this.name = 'ContextTooLargeError';
    this.contextSize = contextSize;
    this.maxSize = maxSize;
  }
}

/**
 * Convert unknown errors to user-friendly messages
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ConfigurationError) {
    return 'Summary generation is not available. Please contact support.';
  }

  if (error instanceof RateLimitError) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error instanceof TimeoutError) {
    return 'Processing took too long. Please try again.';
  }

  if (error instanceof ParseError) {
    return 'Could not process the response. Please try again.';
  }

  if (error instanceof ValidationError) {
    return 'Invalid response received. Please try again.';
  }

  if (error instanceof APIError) {
    return 'Service temporarily unavailable. Please try again later.';
  }

  if (error instanceof ContextTooLargeError) {
    return 'The content is too large to process. Try adding shorter notes.';
  }

  if (error instanceof Error) {
    // Generic error - check for common patterns
    if (error.message.includes('timeout')) {
      return 'Processing took too long. Please try again.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
  }

  return 'Something went wrong. Please try again.';
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIError) {
    return error.retryable;
  }
  // Default to retryable for unknown errors
  return true;
}

/**
 * Get error code for logging
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof AIError) {
    return error.code;
  }
  if (error instanceof Error) {
    return 'UNKNOWN_ERROR';
  }
  return 'UNKNOWN';
}

/**
 * Create an error result object for API responses
 */
export function createErrorResult(error: unknown): {
  success: false;
  error: string;
  code: string;
  retryable: boolean;
} {
  return {
    success: false,
    error: getUserFriendlyMessage(error),
    code: getErrorCode(error),
    retryable: isRetryableError(error),
  };
}
