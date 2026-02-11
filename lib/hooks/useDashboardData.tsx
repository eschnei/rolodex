'use client';

import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to refresh dashboard data on window focus
 * and after certain actions (like marking a contact as reached out)
 */
export function useDashboardRefresh() {
  const router = useRouter();
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refresh = useCallback(() => {
    router.refresh();
    setLastRefresh(new Date());
  }, [router]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if it's been more than 30 seconds since last refresh
      const now = new Date();
      const timeSinceRefresh = now.getTime() - lastRefresh.getTime();
      if (timeSinceRefresh > 30000) {
        refresh();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refresh, lastRefresh]);

  // Refresh on visibility change (when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = new Date();
        const timeSinceRefresh = now.getTime() - lastRefresh.getTime();
        if (timeSinceRefresh > 30000) {
          refresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh, lastRefresh]);

  return { refresh, lastRefresh };
}

interface DashboardRefreshProviderProps {
  children: ReactNode;
}

/**
 * Wrapper component to enable dashboard refresh
 */
export function DashboardRefreshProvider({
  children,
}: DashboardRefreshProviderProps) {
  useDashboardRefresh();
  return <>{children}</>;
}
