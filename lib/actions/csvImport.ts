'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Contact } from '@/lib/database.types';

export interface CsvContact {
  rowIndex: number;
  data: Record<string, string>;
  email: string | null;
}

export interface DuplicateGroup {
  email: string;
  rows: CsvContact[];
}

export interface DbMatch {
  csvContact: CsvContact;
  existingContact: Contact;
}

export interface DuplicateCheckResult {
  cleanContacts: CsvContact[];
  csvDuplicates: DuplicateGroup[];
  dbMatches: DbMatch[];
}

/**
 * Check for duplicates in CSV and against database
 */
export async function checkDuplicates(
  contacts: CsvContact[]
): Promise<{ result: DuplicateCheckResult | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { result: null, error: 'Not authenticated' };
  }

  // Group contacts by email for CSV duplicate detection
  const emailGroups = new Map<string, CsvContact[]>();
  const noEmailContacts: CsvContact[] = [];

  contacts.forEach((contact) => {
    if (contact.email) {
      const existing = emailGroups.get(contact.email) || [];
      existing.push(contact);
      emailGroups.set(contact.email, existing);
    } else {
      noEmailContacts.push(contact);
    }
  });

  // Separate CSV duplicates from unique emails
  const csvDuplicates: DuplicateGroup[] = [];
  const uniqueEmailContacts: CsvContact[] = [];

  emailGroups.forEach((group, email) => {
    if (group.length > 1) {
      csvDuplicates.push({ email, rows: group });
    } else if (group[0]) {
      uniqueEmailContacts.push(group[0]);
    }
  });

  // Check unique emails against database
  const emailsToCheck = uniqueEmailContacts
    .map((c) => c.email)
    .filter((e): e is string => e !== null);

  let existingContacts: Contact[] = [];
  if (emailsToCheck.length > 0) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .in('email', emailsToCheck);

    if (error) {
      return { result: null, error: 'Failed to check existing contacts' };
    }
    existingContacts = data || [];
  }

  // Build lookup for existing contacts
  const existingByEmail = new Map<string, Contact>();
  existingContacts.forEach((contact) => {
    if (contact.email) {
      existingByEmail.set(contact.email.toLowerCase(), contact);
    }
  });

  // Categorize contacts
  const cleanContacts: CsvContact[] = [...noEmailContacts];
  const dbMatches: DbMatch[] = [];

  uniqueEmailContacts.forEach((csvContact) => {
    if (csvContact.email) {
      const existing = existingByEmail.get(csvContact.email);
      if (existing) {
        dbMatches.push({ csvContact, existingContact: existing });
      } else {
        cleanContacts.push(csvContact);
      }
    }
  });

  return {
    result: {
      cleanContacts,
      csvDuplicates,
      dbMatches,
    },
    error: null,
  };
}

export interface ImportSelection {
  // Indices of clean contacts to import
  cleanIndices: number[];
  // For CSV duplicates: email -> selected row index
  csvDuplicateSelections: Record<string, number>;
  // For DB matches: email -> 'skip' | 'merge'
  dbMatchActions: Record<string, 'skip' | 'merge'>;
}

export interface ImportResult {
  imported: number;
  merged: number;
  skipped: number;
}

/**
 * Import selected contacts
 */
export async function importContacts(
  _contacts: CsvContact[],
  duplicateResult: DuplicateCheckResult,
  selection: ImportSelection
): Promise<{ result: ImportResult | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { result: null, error: 'Not authenticated' };
  }

  const toInsert: Record<string, string>[] = [];
  const toMerge: { contactId: string; data: Record<string, string> }[] = [];
  let skipped = 0;

  // Process clean contacts
  duplicateResult.cleanContacts.forEach((contact) => {
    if (selection.cleanIndices.includes(contact.rowIndex)) {
      toInsert.push(contact.data);
    } else {
      skipped++;
    }
  });

  // Process CSV duplicates - only import selected row
  duplicateResult.csvDuplicates.forEach((group) => {
    const selectedRowIndex = selection.csvDuplicateSelections[group.email];
    group.rows.forEach((contact) => {
      if (contact.rowIndex === selectedRowIndex) {
        toInsert.push(contact.data);
      } else {
        skipped++;
      }
    });
  });

  // Process DB matches
  duplicateResult.dbMatches.forEach((match) => {
    const action = selection.dbMatchActions[match.csvContact.email || ''];
    if (action === 'merge') {
      // Only fill empty fields
      const updates: Record<string, string> = {};
      Object.entries(match.csvContact.data).forEach(([field, value]) => {
        const existingValue = match.existingContact[field as keyof Contact];
        if (value && !existingValue) {
          updates[field] = value;
        }
      });
      if (Object.keys(updates).length > 0) {
        toMerge.push({ contactId: match.existingContact.id, data: updates });
      }
    } else {
      skipped++;
    }
  });

  // Insert new contacts
  if (toInsert.length > 0) {
    const insertData = toInsert.map((data) => ({
      user_id: user.id,
      first_name: data.first_name || '',
      last_name: data.last_name || null,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      role: data.role || null,
      location: data.location || null,
      linkedin_url: data.linkedin_url || null,
      name_phonetic: data.name_phonetic || null,
      how_we_met: data.how_we_met || null,
      personal_intel: data.personal_intel || null,
      communication_preference: 'email' as const,
      cadence_days: 30,
    }));

    const { error: insertError } = await supabase
      .from('contacts')
      .insert(insertData);

    if (insertError) {
      console.error('Insert error:', insertError);
      return { result: null, error: 'Failed to import contacts' };
    }
  }

  // Merge into existing contacts
  for (const merge of toMerge) {
    const { error: updateError } = await supabase
      .from('contacts')
      .update({
        ...merge.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merge.contactId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Merge error:', updateError);
      // Continue with others even if one fails
    }
  }

  revalidatePath('/contacts');
  revalidatePath('/dashboard');

  return {
    result: {
      imported: toInsert.length,
      merged: toMerge.length,
      skipped,
    },
    error: null,
  };
}
