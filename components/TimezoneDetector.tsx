'use client';

import { useEffect, useRef } from 'react';
import { getBrowserTimezone } from '@/lib/utils/timezone';
import { updateUserTimezone } from '@/lib/actions/user';

interface TimezoneDetectorProps {
  currentTimezone: string | null;
}

/**
 * Client component that detects user's timezone and updates it if needed.
 * Only runs once on first render if timezone hasn't been set.
 */
export function TimezoneDetector({ currentTimezone }: TimezoneDetectorProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasRun.current) return;
    hasRun.current = true;

    // If timezone is the default, update it with detected timezone
    if (currentTimezone === 'America/New_York') {
      const detectedTimezone = getBrowserTimezone();

      // Only update if different from default
      if (detectedTimezone !== 'America/New_York') {
        updateUserTimezone(detectedTimezone);
      }
    }
  }, [currentTimezone]);

  // This component doesn't render anything
  return null;
}
