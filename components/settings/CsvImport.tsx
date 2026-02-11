'use client';

import { useState, useRef } from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  parseCsv,
  autoDetectMappings,
  validateAndMapRows,
  CONTACT_FIELDS,
  type ContactFieldKey,
  type ParsedCsv,
  type ValidationError,
  type MappedContact,
} from '@/lib/utils/csvParser';
import {
  checkDuplicates,
  importContacts,
  type DuplicateCheckResult,
  type CsvContact,
  type ImportSelection,
} from '@/lib/actions/csvImport';

type Step = 'upload' | 'mapping' | 'validation-error' | 'preview' | 'importing' | 'complete';

const MAX_ROWS = 500;

export function CsvImport() {
  const [step, setStep] = useState<Step>('upload');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV data
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const [mappings, setMappings] = useState<Record<string, ContactFieldKey>>({});

  // Validation
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [mappedContacts, setMappedContacts] = useState<MappedContact[]>([]);

  // Duplicates
  const [duplicateResult, setDuplicateResult] = useState<DuplicateCheckResult | null>(null);

  // Selection state
  const [selectedClean, setSelectedClean] = useState<Set<number>>(new Set());
  const [csvDupeSelections, setCsvDupeSelections] = useState<Record<string, number>>({});
  const [dbMatchActions, setDbMatchActions] = useState<Record<string, 'skip' | 'merge'>>({});

  // Results
  const [importResult, setImportResult] = useState<{ imported: number; merged: number; skipped: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCsv(content);

      if (parsed.rowCount === 0) {
        setError('CSV file is empty');
        return;
      }

      if (parsed.rowCount > MAX_ROWS) {
        setError(`CSV has ${parsed.rowCount} rows. Maximum is ${MAX_ROWS} contacts per upload.`);
        return;
      }

      setParsedCsv(parsed);
      setMappings(autoDetectMappings(parsed.headers));
      setError(null);
      setStep('mapping');
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleMappingChange = (header: string, field: ContactFieldKey) => {
    setMappings((prev) => ({ ...prev, [header]: field }));
  };

  const handleValidate = async () => {
    if (!parsedCsv) return;

    // Check that first_name is mapped
    const hasFirstNameMapping = Object.values(mappings).includes('first_name');
    if (!hasFirstNameMapping) {
      setError('You must map a column to "First Name"');
      return;
    }

    const { contacts, errors } = validateAndMapRows(parsedCsv.rows, mappings);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setStep('validation-error');
      return;
    }

    setMappedContacts(contacts);
    setError(null);

    // Check for duplicates
    const csvContacts: CsvContact[] = contacts.map((c) => ({
      rowIndex: c.rowIndex,
      data: c.data,
      email: c.email,
    }));

    const { result, error: dupeError } = await checkDuplicates(csvContacts);

    if (dupeError || !result) {
      setError(dupeError || 'Failed to check duplicates');
      return;
    }

    setDuplicateResult(result);

    // Initialize selections
    setSelectedClean(new Set(result.cleanContacts.map((c) => c.rowIndex)));

    const dupeSelections: Record<string, number> = {};
    result.csvDuplicates.forEach((group) => {
      const firstRow = group.rows[0];
      if (firstRow) {
        dupeSelections[group.email] = firstRow.rowIndex;
      }
    });
    setCsvDupeSelections(dupeSelections);

    const matchActions: Record<string, 'skip' | 'merge'> = {};
    result.dbMatches.forEach((match) => {
      if (match.csvContact.email) {
        matchActions[match.csvContact.email] = 'skip';
      }
    });
    setDbMatchActions(matchActions);

    setStep('preview');
  };

  const handleImport = async () => {
    if (!duplicateResult) return;

    setStep('importing');

    const csvContacts: CsvContact[] = mappedContacts.map((c) => ({
      rowIndex: c.rowIndex,
      data: c.data,
      email: c.email,
    }));

    const selection: ImportSelection = {
      cleanIndices: Array.from(selectedClean),
      csvDuplicateSelections: csvDupeSelections,
      dbMatchActions,
    };

    const { result, error: importError } = await importContacts(
      csvContacts,
      duplicateResult,
      selection
    );

    if (importError || !result) {
      setError(importError || 'Import failed');
      setStep('preview');
      return;
    }

    setImportResult(result);
    setStep('complete');
  };

  const handleReset = () => {
    setStep('upload');
    setError(null);
    setParsedCsv(null);
    setMappings({});
    setValidationErrors([]);
    setMappedContacts([]);
    setDuplicateResult(null);
    setSelectedClean(new Set());
    setCsvDupeSelections({});
    setDbMatchActions({});
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-[rgba(229,72,77,0.15)] border border-[rgba(229,72,77,0.3)] rounded-[12px] flex items-start gap-3">
          <AlertCircle size={18} className="text-status-overdue flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-status-overdue">{error}</p>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 cursor-pointer',
              'bg-accent text-text-inverse',
              'rounded-[12px] text-[13px] font-medium',
              'hover:bg-accent-hover hover:translate-y-[-1px]',
              'transition-all duration-150',
              'shadow-[0_2px_8px_rgba(91,91,214,0.3)]'
            )}
          >
            <Upload size={16} />
            Upload CSV
          </label>
          <p className="text-[12px] text-[rgba(255,255,255,0.5)] mt-2">
            Maximum {MAX_ROWS} contacts per upload
          </p>
        </div>
      )}

      {/* Step 2: Column Mapping */}
      {step === 'mapping' && parsedCsv && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[rgba(255,255,255,0.95)]">
              Map your CSV columns ({parsedCsv.rowCount} rows)
            </p>
            <button
              onClick={handleReset}
              className="text-[13px] text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.95)]"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {parsedCsv.headers.map((header) => (
              <div key={header} className="flex items-center gap-3">
                <span className="text-[13px] text-[rgba(255,255,255,0.7)] w-[140px] truncate">
                  {header}
                </span>
                <span className="text-[rgba(255,255,255,0.4)]">→</span>
                <select
                  value={mappings[header] || ''}
                  onChange={(e) => handleMappingChange(header, e.target.value as ContactFieldKey)}
                  className={cn(
                    'flex-1 px-3 py-1.5',
                    'text-[13px]',
                    'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.95)]',
                    'border border-[rgba(255,255,255,0.12)] rounded-[8px]',
                    'focus:outline-none focus:border-accent'
                  )}
                >
                  {CONTACT_FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                      {'required' in field && field.required ? ' *' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={handleValidate}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2',
              'bg-accent text-text-inverse',
              'rounded-[12px] text-[13px] font-medium',
              'hover:bg-accent-hover',
              'transition-all duration-150'
            )}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Validation Errors */}
      {step === 'validation-error' && (
        <div className="space-y-4">
          <p className="text-[14px] text-status-overdue">
            Found {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''} in your CSV. Please fix and re-upload.
          </p>

          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {validationErrors.map((err, i) => (
              <p key={i} className="text-[12px] text-[rgba(255,255,255,0.7)]">
                Row {err.row}: {err.message} ({err.field})
              </p>
            ))}
          </div>

          <button
            onClick={handleReset}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2',
              'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.95)]',
              'rounded-[12px] text-[13px] font-medium',
              'hover:bg-[rgba(255,255,255,0.15)]',
              'transition-all duration-150'
            )}
          >
            Upload New File
          </button>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 'preview' && duplicateResult && (
        <PreviewStep
          duplicateResult={duplicateResult}
          selectedClean={selectedClean}
          setSelectedClean={setSelectedClean}
          csvDupeSelections={csvDupeSelections}
          setCsvDupeSelections={setCsvDupeSelections}
          dbMatchActions={dbMatchActions}
          setDbMatchActions={setDbMatchActions}
          onImport={handleImport}
          onCancel={handleReset}
        />
      )}

      {/* Step 5: Importing */}
      {step === 'importing' && (
        <div className="py-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[14px] text-[rgba(255,255,255,0.7)]">Importing contacts...</p>
        </div>
      )}

      {/* Step 6: Complete */}
      {step === 'complete' && importResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-status-ontrack">
            <Check size={20} />
            <span className="text-[14px] font-medium">Import complete!</span>
          </div>
          <div className="text-[13px] text-[rgba(255,255,255,0.7)] space-y-1">
            <p>{importResult.imported} contact{importResult.imported !== 1 ? 's' : ''} imported</p>
            {importResult.merged > 0 && (
              <p>{importResult.merged} contact{importResult.merged !== 1 ? 's' : ''} merged</p>
            )}
            {importResult.skipped > 0 && (
              <p>{importResult.skipped} skipped</p>
            )}
          </div>
          <button
            onClick={handleReset}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2',
              'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.95)]',
              'rounded-[12px] text-[13px] font-medium',
              'hover:bg-[rgba(255,255,255,0.15)]',
              'transition-all duration-150'
            )}
          >
            Import Another
          </button>
        </div>
      )}
    </div>
  );
}

interface PreviewStepProps {
  duplicateResult: DuplicateCheckResult;
  selectedClean: Set<number>;
  setSelectedClean: React.Dispatch<React.SetStateAction<Set<number>>>;
  csvDupeSelections: Record<string, number>;
  setCsvDupeSelections: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  dbMatchActions: Record<string, 'skip' | 'merge'>;
  setDbMatchActions: React.Dispatch<React.SetStateAction<Record<string, 'skip' | 'merge'>>>;
  onImport: () => void;
  onCancel: () => void;
}

function PreviewStep({
  duplicateResult,
  selectedClean,
  setSelectedClean,
  csvDupeSelections,
  setCsvDupeSelections,
  dbMatchActions,
  setDbMatchActions,
  onImport,
  onCancel,
}: PreviewStepProps) {
  const { cleanContacts, csvDuplicates, dbMatches } = duplicateResult;

  const totalToImport =
    selectedClean.size +
    Object.keys(csvDupeSelections).length +
    Object.values(dbMatchActions).filter((a) => a === 'merge').length;

  const toggleClean = (rowIndex: number) => {
    setSelectedClean((prev) => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  };

  const selectAllClean = () => {
    setSelectedClean(new Set(cleanContacts.map((c) => c.rowIndex)));
  };

  const deselectAllClean = () => {
    setSelectedClean(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-[rgba(255,255,255,0.95)]">
          Review import ({totalToImport} will be imported)
        </p>
        <button
          onClick={onCancel}
          className="text-[13px] text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.95)]"
        >
          Cancel
        </button>
      </div>

      {/* Clean contacts */}
      {cleanContacts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-medium text-[rgba(255,255,255,0.5)] uppercase tracking-wide">
              Ready to Import ({cleanContacts.length})
            </h4>
            <div className="flex gap-2 text-[12px]">
              <button onClick={selectAllClean} className="text-accent hover:underline">Select all</button>
              <button onClick={deselectAllClean} className="text-[rgba(255,255,255,0.5)] hover:underline">Deselect all</button>
            </div>
          </div>
          <div className="max-h-[150px] overflow-y-auto space-y-1">
            {cleanContacts.map((contact) => (
              <label
                key={contact.rowIndex}
                className="flex items-center gap-2 p-2 rounded-[8px] hover:bg-[rgba(255,255,255,0.04)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedClean.has(contact.rowIndex)}
                  onChange={() => toggleClean(contact.rowIndex)}
                  className="rounded"
                />
                <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
                  {contact.data.first_name} {contact.data.last_name}
                </span>
                {contact.email && (
                  <span className="text-[12px] text-[rgba(255,255,255,0.5)]">
                    ({contact.email})
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* CSV Duplicates */}
      {csvDuplicates.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[12px] font-medium text-status-due uppercase tracking-wide">
            Duplicates in CSV ({csvDuplicates.length} groups)
          </h4>
          <p className="text-[12px] text-[rgba(255,255,255,0.5)]">
            These emails appear multiple times. Select which to keep.
          </p>
          <div className="space-y-3">
            {csvDuplicates.map((group) => (
              <div key={group.email} className="p-3 bg-[rgba(240,158,0,0.08)] rounded-[8px] border border-[rgba(240,158,0,0.2)]">
                <p className="text-[12px] text-status-due mb-2">{group.email}</p>
                <div className="space-y-1">
                  {group.rows.map((contact) => (
                    <label
                      key={contact.rowIndex}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`dupe-${group.email}`}
                        checked={csvDupeSelections[group.email] === contact.rowIndex}
                        onChange={() =>
                          setCsvDupeSelections((prev) => ({
                            ...prev,
                            [group.email]: contact.rowIndex,
                          }))
                        }
                      />
                      <span className="text-[13px] text-[rgba(255,255,255,0.95)]">
                        {contact.data.first_name} {contact.data.last_name}
                        {contact.data.company && ` - ${contact.data.company}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DB Matches */}
      {dbMatches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[12px] font-medium text-accent uppercase tracking-wide">
            Already Exists ({dbMatches.length})
          </h4>
          <p className="text-[12px] text-[rgba(255,255,255,0.5)]">
            These emails already exist. Choose to merge (fill empty fields) or skip.
          </p>
          <div className="space-y-2">
            {dbMatches.map((match) => (
              <div
                key={match.csvContact.email}
                className="p-3 bg-[rgba(91,91,214,0.08)] rounded-[8px] border border-[rgba(91,91,214,0.2)]"
              >
                <p className="text-[13px] text-[rgba(255,255,255,0.95)] mb-2">
                  {match.existingContact.first_name} {match.existingContact.last_name}
                  <span className="text-[rgba(255,255,255,0.5)]"> ({match.csvContact.email})</span>
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`match-${match.csvContact.email}`}
                      checked={dbMatchActions[match.csvContact.email || ''] === 'skip'}
                      onChange={() =>
                        setDbMatchActions((prev) => ({
                          ...prev,
                          [match.csvContact.email || '']: 'skip',
                        }))
                      }
                    />
                    <span className="text-[13px] text-[rgba(255,255,255,0.7)]">Skip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`match-${match.csvContact.email}`}
                      checked={dbMatchActions[match.csvContact.email || ''] === 'merge'}
                      onChange={() =>
                        setDbMatchActions((prev) => ({
                          ...prev,
                          [match.csvContact.email || '']: 'merge',
                        }))
                      }
                    />
                    <span className="text-[13px] text-[rgba(255,255,255,0.7)]">Merge empty fields</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onImport}
        disabled={totalToImport === 0}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2',
          'bg-accent text-text-inverse',
          'rounded-[12px] text-[13px] font-medium',
          'hover:bg-accent-hover',
          'transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        Import {totalToImport} Contact{totalToImport !== 1 ? 's' : ''}
      </button>
    </div>
  );
}
