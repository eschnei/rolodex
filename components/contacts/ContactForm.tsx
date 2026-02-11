'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button } from '@/components/ui';
import { createContact, updateContact } from '@/lib/actions/contacts';
import { type Contact } from '@/lib/database.types';
import { communicationPreferences } from '@/lib/validations/contact';
import { cn } from '@/lib/utils/cn';

interface ContactFormProps {
  /** Existing contact for edit mode, undefined for create mode */
  contact?: Contact;
  /** Callback after successful form submission */
  onSuccess?: (contactId: string) => void;
}

const CADENCE_OPTIONS = [
  { value: 7, label: 'Weekly (7 days)' },
  { value: 14, label: 'Bi-weekly (14 days)' },
  { value: 30, label: 'Monthly (30 days)' },
  { value: 60, label: 'Bi-monthly (60 days)' },
  { value: 90, label: 'Quarterly (90 days)' },
  { value: 180, label: 'Twice a year (180 days)' },
  { value: 365, label: 'Yearly (365 days)' },
];

const COMMUNICATION_LABELS: Record<string, string> = {
  email: 'Email',
  text: 'Text Message',
  phone: 'Phone Call',
  'in-person': 'In Person',
};

/**
 * Helper to get error for a field, returns undefined if no error
 */
function getFieldError(
  errors: Record<string, string>,
  field: string
): string | undefined {
  const error = errors[field];
  return error ? error : undefined;
}

/**
 * Contact form for creating or editing contacts
 * Handles validation and submission via server actions
 */
export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isEditMode = !!contact;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEditMode
        ? await updateContact(contact.id, formData)
        : await createContact(formData);

      if (!result.success) {
        setError(result.error || 'An error occurred');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        return;
      }

      if (onSuccess && result.contactId) {
        onSuccess(result.contactId);
      } else if (result.contactId) {
        router.push(`/contacts/${result.contactId}`);
      } else {
        router.push('/contacts');
      }
    });
  };

  const handleCancel = () => {
    if (isEditMode) {
      router.push(`/contacts/${contact.id}`);
    } else {
      router.push('/contacts');
    }
  };

  // Helper to get field error prop
  const err = (field: string) => getFieldError(fieldErrors, field);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General error message */}
      {error && (
        <div className="p-4 bg-[rgba(229,72,77,0.15)] border border-[rgba(229,72,77,0.3)] rounded-[12px]">
          <p className="text-[13px] text-status-overdue">{error}</p>
        </div>
      )}

      {/* Basic Info Section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="first_name"
            placeholder="John"
            defaultValue={contact?.first_name || ''}
            error={err('first_name')}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            placeholder="Doe"
            defaultValue={contact?.last_name || ''}
            error={err('last_name')}
          />
        </div>

        <Input
          label="Name Phonetics"
          name="name_phonetic"
          placeholder="JAHN DOH"
          defaultValue={contact?.name_phonetic || ''}
          error={err('name_phonetic')}
          helperText="Pronunciation guide for their name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            defaultValue={contact?.email || ''}
            error={err('email')}
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            defaultValue={contact?.phone || ''}
            error={err('phone')}
          />
        </div>
      </section>

      {/* Professional Info Section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">Professional</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company"
            name="company"
            placeholder="Acme Inc."
            defaultValue={contact?.company || ''}
            error={err('company')}
          />
          <Input
            label="Role"
            name="role"
            placeholder="Software Engineer"
            defaultValue={contact?.role || ''}
            error={err('role')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            name="location"
            placeholder="San Francisco, CA"
            defaultValue={contact?.location || ''}
            error={err('location')}
          />
          <Input
            label="LinkedIn"
            name="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            defaultValue={contact?.linkedin_url || ''}
            error={err('linkedin_url')}
          />
        </div>
      </section>

      {/* Context Section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">Context</h2>

        <Textarea
          label="How We Met"
          name="how_we_met"
          placeholder="We met at a tech conference in 2023..."
          defaultValue={contact?.how_we_met || ''}
          error={err('how_we_met')}
          rows={3}
        />

        <Textarea
          label="Personal Intel"
          name="personal_intel"
          placeholder="Key details to remember: interests, family, projects..."
          defaultValue={contact?.personal_intel || ''}
          error={err('personal_intel')}
          helperText="Private notes about this contact that help you stay connected"
          rows={4}
        />
      </section>

      {/* Communication Preferences Section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[rgba(255,255,255,0.5)]">Communication</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Communication Preference */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="communication_preference"
              className="text-[12px] font-medium text-[rgba(255,255,255,0.6)]"
            >
              Preferred Contact Method
            </label>
            <select
              id="communication_preference"
              name="communication_preference"
              defaultValue={contact?.communication_preference || 'email'}
              className={cn(
                'w-full px-3 py-2',
                'text-[14px] leading-relaxed',
                'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.95)]',
                'border border-[rgba(255,255,255,0.12)] rounded-[12px]',
                'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-[rgba(91,91,214,0.2)]',
                'transition-[border-color,box-shadow] duration-150'
              )}
            >
              {communicationPreferences.map((pref) => (
                <option key={pref} value={pref}>
                  {COMMUNICATION_LABELS[pref]}
                </option>
              ))}
            </select>
          </div>

          {/* Cadence Days */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cadence_days"
              className="text-[12px] font-medium text-[rgba(255,255,255,0.6)]"
            >
              Contact Cadence
            </label>
            <select
              id="cadence_days"
              name="cadence_days"
              defaultValue={contact?.cadence_days || 30}
              className={cn(
                'w-full px-3 py-2',
                'text-[14px] leading-relaxed',
                'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.95)]',
                'border border-[rgba(255,255,255,0.12)] rounded-[12px]',
                'focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-[rgba(91,91,214,0.2)]',
                'transition-[border-color,box-shadow] duration-150'
              )}
            >
              {CADENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-[12px] text-[rgba(255,255,255,0.5)]">
              How often you want to reach out to this contact
            </span>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending}>
          {isEditMode ? 'Save Changes' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
}
