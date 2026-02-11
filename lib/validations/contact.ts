import { z } from 'zod';

/**
 * Communication preference options
 */
export const communicationPreferences = [
  'email',
  'text',
  'phone',
  'in-person',
] as const;

export type CommunicationPreference = (typeof communicationPreferences)[number];

/**
 * Zod schema for creating a new contact
 */
export const createContactSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),
  last_name: z
    .string()
    .max(100, 'Last name must be 100 characters or less')
    .optional()
    .nullable()
    .transform((val) => val || null),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  phone: z
    .string()
    .max(50, 'Phone number must be 50 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  company: z
    .string()
    .max(150, 'Company name must be 150 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  role: z
    .string()
    .max(150, 'Role must be 150 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  location: z
    .string()
    .max(200, 'Location must be 200 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  how_we_met: z
    .string()
    .max(500, 'How we met must be 500 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  linkedin_url: z
    .string()
    .url('Please enter a valid URL')
    .max(500, 'LinkedIn URL must be 500 characters or less')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  name_phonetic: z
    .string()
    .max(200, 'Name phonetics must be 200 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  communication_preference: z
    .enum(communicationPreferences)
    .default('email'),
  personal_intel: z
    .string()
    .max(2000, 'Personal intel must be 2000 characters or less')
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() !== '' ? val : null)),
  cadence_days: z
    .number()
    .int('Cadence must be a whole number')
    .min(1, 'Cadence must be at least 1 day')
    .max(365, 'Cadence must be 365 days or less')
    .default(30),
});

/**
 * Zod schema for updating an existing contact
 * Same as create schema but all fields are optional
 */
export const updateContactSchema = createContactSchema.partial();

/**
 * Type for contact form data (input before validation)
 */
export type ContactFormData = z.input<typeof createContactSchema>;

/**
 * Type for validated contact data (output after validation)
 */
export type ValidatedContactData = z.output<typeof createContactSchema>;

/**
 * Validate contact form data for creation
 */
export function validateCreateContact(data: unknown) {
  return createContactSchema.safeParse(data);
}

/**
 * Validate contact form data for update
 */
export function validateUpdateContact(data: unknown) {
  return updateContactSchema.safeParse(data);
}

/**
 * Format validation errors into a user-friendly object
 */
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return errors;
}
