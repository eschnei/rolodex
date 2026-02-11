import { User } from '@/lib/database.types';

/**
 * Check if a user should receive a digest based on their settings and time
 */
export function shouldSendDigest(
  user: User,
  currentTimeInUserTz: Date
): boolean {
  // Must have digest enabled
  if (!user.digest_enabled) {
    return false;
  }

  // Must have Gmail connected
  if (!user.gmail_refresh_token) {
    return false;
  }

  // Parse user's digest time (format: "HH:MM:SS")
  const timeParts = user.digest_time.split(':').map(Number);
  const hours = timeParts[0] ?? 8;
  const minutes = timeParts[1] ?? 0;

  // Get current hour and minute in user's timezone
  const currentHour = currentTimeInUserTz.getHours();
  const currentMinute = currentTimeInUserTz.getMinutes();

  // Check if current time is within the digest window
  // We check if we're within 15 minutes after the digest time
  const digestTimeMinutes = hours * 60 + minutes;
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const timeDiff = currentTimeMinutes - digestTimeMinutes;

  // Within 15 minute window after digest time
  if (timeDiff < 0 || timeDiff >= 15) {
    return false;
  }

  // Check if digest was already sent today
  if (user.last_digest_sent_at) {
    const lastSent = new Date(user.last_digest_sent_at);
    const today = new Date();

    // Compare dates (ignoring time)
    if (
      lastSent.getFullYear() === today.getFullYear() &&
      lastSent.getMonth() === today.getMonth() &&
      lastSent.getDate() === today.getDate()
    ) {
      return false;
    }
  }

  return true;
}
