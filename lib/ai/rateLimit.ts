/**
 * Rate Limiting for AI API Calls
 *
 * Implements rate limiting with exponential backoff to prevent
 * API abuse and handle rate limit responses gracefully.
 */

import { RateLimitError } from './errors';

// In-memory rate limit tracking
// In production, this would use Redis or similar for distributed tracking
interface RateLimitState {
  tokens: number;
  lastRefill: number;
  backoffUntil: number;
}

// Rate limit configuration
const config = {
  // Maximum requests per minute per user
  maxRequestsPerMinute: 10,
  // Refill rate (tokens per second)
  refillRate: 10 / 60,
  // Maximum backoff time in milliseconds
  maxBackoffMs: 60000,
  // Base backoff time in milliseconds
  baseBackoffMs: 1000,
};

// User rate limit states (keyed by user ID)
const userStates = new Map<string, RateLimitState>();

// Debounce states for note saves (keyed by note content hash)
const pendingRequests = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_DELAY_MS = 2000; // 2 second debounce for rapid saves

/**
 * Check if a request is allowed under rate limits
 * Uses token bucket algorithm
 */
export function checkRateLimit(userId: string): {
  allowed: boolean;
  waitMs?: number;
} {
  const now = Date.now();
  let state = userStates.get(userId);

  // Initialize state if not exists
  if (!state) {
    state = {
      tokens: config.maxRequestsPerMinute,
      lastRefill: now,
      backoffUntil: 0,
    };
    userStates.set(userId, state);
  }

  // Check if in backoff period
  if (now < state.backoffUntil) {
    return {
      allowed: false,
      waitMs: state.backoffUntil - now,
    };
  }

  // Refill tokens based on elapsed time
  const elapsedSeconds = (now - state.lastRefill) / 1000;
  const tokensToAdd = elapsedSeconds * config.refillRate;
  state.tokens = Math.min(
    config.maxRequestsPerMinute,
    state.tokens + tokensToAdd
  );
  state.lastRefill = now;

  // Check if we have tokens available
  if (state.tokens < 1) {
    const waitMs = Math.ceil((1 - state.tokens) / config.refillRate * 1000);
    return {
      allowed: false,
      waitMs,
    };
  }

  // Consume a token
  state.tokens -= 1;
  return { allowed: true };
}

/**
 * Apply backoff after a rate limit error from the API
 */
export function applyBackoff(
  userId: string,
  retryAfter?: number
): void {
  const state = userStates.get(userId);
  if (!state) return;

  // Use retry-after header if provided, otherwise use exponential backoff
  let backoffMs = retryAfter ? retryAfter * 1000 : config.baseBackoffMs;

  // Calculate exponential backoff based on current state
  const currentBackoff = state.backoffUntil - Date.now();
  if (currentBackoff > 0) {
    // Already in backoff, double it
    backoffMs = Math.min(currentBackoff * 2, config.maxBackoffMs);
  }

  state.backoffUntil = Date.now() + backoffMs;
}

/**
 * Reset backoff on successful request
 */
export function resetBackoff(userId: string): void {
  const state = userStates.get(userId);
  if (state) {
    state.backoffUntil = 0;
  }
}

/**
 * Debounce rapid note saves
 * Returns a promise that resolves when it's time to process
 */
export function debounceRequest(
  requestKey: string,
  callback: () => void
): void {
  // Cancel any pending request for this key
  const existingTimeout = pendingRequests.get(requestKey);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Schedule new request
  const timeout = setTimeout(() => {
    pendingRequests.delete(requestKey);
    callback();
  }, DEBOUNCE_DELAY_MS);

  pendingRequests.set(requestKey, timeout);
}

/**
 * Cancel a pending debounced request
 */
export function cancelDebounce(requestKey: string): void {
  const timeout = pendingRequests.get(requestKey);
  if (timeout) {
    clearTimeout(timeout);
    pendingRequests.delete(requestKey);
  }
}

/**
 * Wrap an API call with rate limiting
 */
export async function withRateLimit<T>(
  userId: string,
  fn: () => Promise<T>
): Promise<T> {
  const { allowed, waitMs } = checkRateLimit(userId);

  if (!allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Please wait ${Math.ceil((waitMs || 0) / 1000)} seconds.`,
      waitMs ? Math.ceil(waitMs / 1000) : undefined
    );
  }

  try {
    const result = await fn();
    resetBackoff(userId);
    return result;
  } catch (error) {
    // If it's a rate limit error from the API, apply backoff
    if (
      error instanceof Error &&
      (error.message.includes('rate') || error.message.includes('429'))
    ) {
      applyBackoff(userId);
    }
    throw error;
  }
}

/**
 * Clean up old entries from the rate limit map
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimitStates(): void {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes

  const entries = Array.from(userStates.entries());
  for (const [userId, state] of entries) {
    if (now - state.lastRefill > maxAge && state.backoffUntil < now) {
      userStates.delete(userId);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStates, 5 * 60 * 1000);
}
