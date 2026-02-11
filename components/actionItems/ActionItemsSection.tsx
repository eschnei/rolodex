'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardBody, Skeleton } from '@/components/ui';
import { ActionItem } from './ActionItem';
import { AddActionItem } from './AddActionItem';
import { ActionItemsFilter } from './ActionItemsFilter';
import { getActionItems } from '@/lib/actions/actionItems';
import { cn } from '@/lib/utils/cn';
import type { ActionItem as ActionItemType } from '@/lib/database.types';

interface ActionItemsSectionProps {
  /** Contact ID to display action items for */
  contactId: string;
  /** Initial action items from server */
  initialActionItems?: ActionItemType[];
  /** Additional className */
  className?: string;
}

/**
 * Complete action items section
 *
 * Features:
 * - Filter toggle (Open only vs All)
 * - List of action items with checkboxes
 * - Add action item inline input
 * - Counts for open and total items
 * - Auto-refresh when items change
 */
export function ActionItemsSection({
  contactId,
  initialActionItems = [],
  className,
}: ActionItemsSectionProps) {
  const [actionItems, setActionItems] = useState<ActionItemType[]>(initialActionItems);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate counts
  const openCount = actionItems.filter((item) => !item.is_completed).length;
  const totalCount = actionItems.length;

  // Filtered items based on current filter
  const filteredItems = showOpenOnly
    ? actionItems.filter((item) => !item.is_completed)
    : actionItems;

  // Fetch action items
  const fetchActionItems = useCallback(async () => {
    setIsLoading(true);
    try {
      // Always fetch all items so we can calculate counts
      const result = await getActionItems(contactId, true);
      if (result.success && result.actionItems) {
        setActionItems(result.actionItems);
      }
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  // Initial fetch
  useEffect(() => {
    if (initialActionItems.length === 0) {
      fetchActionItems();
    }
  }, [fetchActionItems, initialActionItems.length]);

  // Handle item updated (toggled or deleted)
  const handleUpdated = () => {
    fetchActionItems();
  };

  // Handle item created
  const handleCreated = () => {
    fetchActionItems();
  };

  // Loading state
  const renderLoading = () => (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border-subtle"
        >
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const renderEmpty = () => (
    <div
      className={cn(
        'py-6 text-center',
        'border border-dashed border-border-subtle rounded-lg'
      )}
    >
      <p className="type-body text-text-tertiary">
        {showOpenOnly ? 'No open action items' : 'No action items yet'}
      </p>
      {showOpenOnly && totalCount > 0 && (
        <p className="type-small text-text-tertiary mt-1">
          {totalCount} completed item{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );

  return (
    <Card className={className}>
      {/* Header with title and filter */}
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <h2 className="type-h3 text-text-primary">Action Items</h2>
        <ActionItemsFilter
          showOpenOnly={showOpenOnly}
          onChange={setShowOpenOnly}
          openCount={openCount}
          totalCount={totalCount}
        />
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Add action item */}
        <AddActionItem
          contactId={contactId}
          onCreated={handleCreated}
        />

        {/* Action items list */}
        {isLoading ? (
          renderLoading()
        ) : filteredItems.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <ActionItem
                key={item.id}
                actionItem={item}
                onUpdated={handleUpdated}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
