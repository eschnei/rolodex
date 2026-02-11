/**
 * CSV Parser utility for contact imports
 */

export interface ParsedCsvRow {
  [key: string]: string;
}

export interface ParsedCsv {
  headers: string[];
  rows: ParsedCsvRow[];
  rowCount: number;
}

/**
 * Parse a CSV string into headers and rows
 */
export function parseCsv(csvContent: string): ParsedCsv {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== '');

  const firstLine = lines[0];
  if (lines.length === 0 || !firstLine) {
    return { headers: [], rows: [], rowCount: 0 };
  }

  // Parse headers from first line
  const headers = parseCsvLine(firstLine);

  // Parse data rows
  const rows: ParsedCsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const values = parseCsvLine(line);
    const row: ParsedCsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    rows.push(row);
  }

  return {
    headers,
    rows,
    rowCount: rows.length,
  };
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Contact field options for mapping
 */
export const CONTACT_FIELDS = [
  { value: '', label: 'Skip this column' },
  { value: 'first_name', label: 'First Name', required: true },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'role', label: 'Role / Title' },
  { value: 'location', label: 'Location' },
  { value: 'linkedin_url', label: 'LinkedIn URL' },
  { value: 'name_phonetic', label: 'Name Phonetics' },
  { value: 'how_we_met', label: 'How We Met' },
  { value: 'personal_intel', label: 'Personal Intel' },
] as const;

export type ContactFieldKey = (typeof CONTACT_FIELDS)[number]['value'];

/**
 * Auto-detect column mappings based on header names
 */
export function autoDetectMappings(
  headers: string[]
): Record<string, ContactFieldKey> {
  const mappings: Record<string, ContactFieldKey> = {};

  const patterns: Record<ContactFieldKey, RegExp[]> = {
    first_name: [/^first[_\s]?name$/i, /^first$/i, /^given[_\s]?name$/i],
    last_name: [/^last[_\s]?name$/i, /^last$/i, /^surname$/i, /^family[_\s]?name$/i],
    email: [/^email$/i, /^e-?mail$/i, /^email[_\s]?address$/i],
    phone: [/^phone$/i, /^telephone$/i, /^mobile$/i, /^cell$/i, /^phone[_\s]?number$/i],
    company: [/^company$/i, /^organization$/i, /^org$/i, /^employer$/i],
    role: [/^role$/i, /^title$/i, /^job[_\s]?title$/i, /^position$/i],
    location: [/^location$/i, /^city$/i, /^address$/i],
    linkedin_url: [/^linkedin$/i, /^linkedin[_\s]?url$/i],
    name_phonetic: [/^phonetic$/i, /^pronunciation$/i],
    how_we_met: [/^how[_\s]?we[_\s]?met$/i, /^notes$/i, /^source$/i],
    personal_intel: [/^intel$/i, /^personal$/i],
    '': [],
  };

  headers.forEach((header) => {
    let matched = false;
    for (const [field, regexes] of Object.entries(patterns)) {
      if (regexes.some((regex) => regex.test(header))) {
        mappings[header] = field as ContactFieldKey;
        matched = true;
        break;
      }
    }
    if (!matched) {
      mappings[header] = '';
    }
  });

  return mappings;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Empty is valid (not required)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface MappedContact {
  rowIndex: number;
  data: Record<string, string>;
  email: string | null;
}

/**
 * Apply mappings and validate rows
 */
export function validateAndMapRows(
  rows: ParsedCsvRow[],
  mappings: Record<string, ContactFieldKey>
): { contacts: MappedContact[]; errors: ValidationError[] } {
  const contacts: MappedContact[] = [];
  const errors: ValidationError[] = [];

  rows.forEach((row, index) => {
    const mappedData: Record<string, string> = {};
    let hasFirstName = false;

    // Apply mappings
    Object.entries(mappings).forEach(([csvHeader, contactField]) => {
      if (contactField && row[csvHeader]) {
        mappedData[contactField] = row[csvHeader];

        if (contactField === 'first_name') {
          hasFirstName = true;
        }
      }
    });

    // Validate required fields
    if (!hasFirstName || !mappedData.first_name?.trim()) {
      errors.push({
        row: index + 2, // +2 for 1-indexed and header row
        field: 'first_name',
        message: 'First name is required',
      });
    }

    // Validate email format if provided
    if (mappedData.email && !isValidEmail(mappedData.email)) {
      errors.push({
        row: index + 2,
        field: 'email',
        message: 'Invalid email format',
      });
    }

    // Validate LinkedIn URL if provided
    if (mappedData.linkedin_url && !mappedData.linkedin_url.includes('linkedin.com')) {
      errors.push({
        row: index + 2,
        field: 'linkedin_url',
        message: 'Invalid LinkedIn URL',
      });
    }

    contacts.push({
      rowIndex: index,
      data: mappedData,
      email: mappedData.email?.toLowerCase() || null,
    });
  });

  return { contacts, errors };
}
