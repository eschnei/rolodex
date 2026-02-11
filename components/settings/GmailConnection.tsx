'use client';

import { useState } from 'react';
import { Mail, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface GmailConnectionProps {
  isConnected: boolean;
  userEmail?: string;
  className?: string;
}

/**
 * Gmail connection component for settings page
 * Shows connection status and allows connecting/disconnecting Gmail
 */
export function GmailConnection({
  isConnected,
  userEmail,
  className,
}: GmailConnectionProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = () => {
    // Redirect to Gmail OAuth endpoint
    window.location.href = '/api/auth/gmail';
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail? You will no longer receive email digests.')) {
      return;
    }

    setIsDisconnecting(true);

    try {
      const response = await fetch('/api/auth/gmail/disconnect', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to disconnect Gmail. Please try again.');
      }
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
      alert('Failed to disconnect Gmail. Please try again.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div
      className={cn(
        'p-5 bg-bg-secondary border border-border-subtle rounded-lg',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              isConnected ? 'bg-status-ontrack-bg' : 'bg-bg-inset'
            )}
          >
            <Mail
              size={20}
              className={isConnected ? 'text-status-ontrack' : 'text-text-tertiary'}
              strokeWidth={1.5}
            />
          </div>

          <div>
            <h3 className="type-body font-medium text-text-primary">
              Gmail Connection
            </h3>
            <p className="type-small text-text-secondary mt-0.5">
              {isConnected
                ? `Connected as ${userEmail || 'Gmail account'}`
                : 'Connect Gmail to receive email digests'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-status-ontrack-bg text-status-ontrack-text rounded-full text-[11px] font-medium">
                <Check size={12} strokeWidth={2} />
                Connected
              </span>
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5',
                  'text-[13px] font-medium text-text-secondary',
                  'border border-border-subtle rounded-md',
                  'hover:bg-bg-hover hover:text-text-primary',
                  'transition-colors duration-fast',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isDisconnecting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <X size={14} strokeWidth={1.5} />
                )}
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2',
                'bg-accent text-text-inverse',
                'rounded-md font-medium text-[13px]',
                'hover:bg-accent-hover transition-colors duration-fast'
              )}
            >
              <Mail size={16} strokeWidth={1.5} />
              Connect Gmail
            </button>
          )}
        </div>
      </div>

      {!isConnected && (
        <p className="type-small text-text-tertiary mt-3 pl-[52px]">
          We use Gmail to send yourself reminder emails. We only request
          permission to send emails - we never read your inbox.
        </p>
      )}
    </div>
  );
}
