'use client';

import { useState, useTransition } from 'react';
import { Bell, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { updateUserProfile } from '@/lib/actions/user';
import { TIMEZONE_OPTIONS } from '@/lib/utils/timezone';

interface DigestSettingsProps {
  digestEnabled: boolean;
  digestTime: string;
  skipWhenCaughtUp: boolean;
  timezone: string;
  isGmailConnected: boolean;
  className?: string;
}

// Time options for digest (every hour)
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const value = `${hour.toString().padStart(2, '0')}:00:00`;
  const label = `${hour12}:00 ${ampm}`;
  return { value, label };
});

/**
 * Digest settings component for configuring email notifications
 */
export function DigestSettings({
  digestEnabled: initialDigestEnabled,
  digestTime: initialDigestTime,
  skipWhenCaughtUp: initialSkipWhenCaughtUp,
  timezone: initialTimezone,
  isGmailConnected,
  className,
}: DigestSettingsProps) {
  const [digestEnabled, setDigestEnabled] = useState(initialDigestEnabled);
  const [digestTime, setDigestTime] = useState(initialDigestTime);
  const [skipWhenCaughtUp, setSkipWhenCaughtUp] = useState(initialSkipWhenCaughtUp);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = async (updates: {
    digest_enabled?: boolean;
    digest_time?: string;
    skip_when_caught_up?: boolean;
    timezone?: string;
  }) => {
    setSaveStatus('saving');

    startTransition(async () => {
      const result = await updateUserProfile(updates);

      if (result.error) {
        console.error('Failed to save settings:', result.error);
        setSaveStatus('idle');
        return;
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    });
  };

  const toggleDigestEnabled = () => {
    const newValue = !digestEnabled;
    setDigestEnabled(newValue);
    handleSave({ digest_enabled: newValue });
  };

  const toggleSkipWhenCaughtUp = () => {
    const newValue = !skipWhenCaughtUp;
    setSkipWhenCaughtUp(newValue);
    handleSave({ skip_when_caught_up: newValue });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setDigestTime(newValue);
    handleSave({ digest_time: newValue });
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setTimezone(newValue);
    handleSave({ timezone: newValue });
  };

  return (
    <div
      className={cn(
        'p-5 bg-bg-secondary border border-border-subtle rounded-lg space-y-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center">
            <Bell size={20} className="text-accent-text" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="type-body font-medium text-text-primary">
              Daily Digest
            </h3>
            <p className="type-small text-text-secondary">
              Get a daily email reminder of contacts to reach out to
            </p>
          </div>
        </div>

        {saveStatus === 'saved' && (
          <span className="inline-flex items-center gap-1 text-[11px] text-status-ontrack-text">
            <Check size={12} strokeWidth={2} />
            Saved
          </span>
        )}
      </div>

      {/* Gmail not connected warning */}
      {!isGmailConnected && (
        <div className="p-3 bg-status-due-bg border border-status-due/20 rounded-md">
          <p className="type-small text-status-due-text">
            Connect Gmail above to enable email digests.
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="space-y-4">
        {/* Enable/Disable toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="type-body text-text-primary">Enable Daily Digest</p>
            <p className="type-small text-text-tertiary">
              Receive a daily email summary
            </p>
          </div>
          <button
            onClick={toggleDigestEnabled}
            disabled={isPending || !isGmailConnected}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
              digestEnabled && isGmailConnected
                ? 'bg-accent'
                : 'bg-bg-inset',
              (!isGmailConnected || isPending) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                digestEnabled && isGmailConnected
                  ? 'translate-x-6'
                  : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Digest time */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="type-body text-text-primary">Delivery Time</p>
            <p className="type-small text-text-tertiary">
              When to send your daily digest
            </p>
          </div>
          <select
            value={digestTime}
            onChange={handleTimeChange}
            disabled={isPending || !digestEnabled || !isGmailConnected}
            className={cn(
              'px-3 py-1.5 rounded-md border border-border-subtle',
              'bg-bg-secondary text-text-primary text-[13px]',
              'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
              (!digestEnabled || !isGmailConnected || isPending) &&
                'opacity-50 cursor-not-allowed'
            )}
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timezone */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="type-body text-text-primary">Timezone</p>
            <p className="type-small text-text-tertiary">
              Used for scheduling digests
            </p>
          </div>
          <select
            value={timezone}
            onChange={handleTimezoneChange}
            disabled={isPending}
            className={cn(
              'px-3 py-1.5 rounded-md border border-border-subtle',
              'bg-bg-secondary text-text-primary text-[13px]',
              'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
              'max-w-[200px]',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skip when caught up */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="type-body text-text-primary">Skip When Caught Up</p>
            <p className="type-small text-text-tertiary">
              Dont send if all contacts are on track
            </p>
          </div>
          <button
            onClick={toggleSkipWhenCaughtUp}
            disabled={isPending || !digestEnabled || !isGmailConnected}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
              skipWhenCaughtUp && digestEnabled && isGmailConnected
                ? 'bg-accent'
                : 'bg-bg-inset',
              (!digestEnabled || !isGmailConnected || isPending) &&
                'opacity-50 cursor-not-allowed'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                skipWhenCaughtUp && digestEnabled && isGmailConnected
                  ? 'translate-x-6'
                  : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
