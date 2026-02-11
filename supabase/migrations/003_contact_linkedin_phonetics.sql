-- Add LinkedIn URL and name phonetics to contacts table
-- Migration: 003_contact_linkedin_phonetics.sql

ALTER TABLE contacts
ADD COLUMN linkedin_url TEXT,
ADD COLUMN name_phonetic TEXT;

-- Add comment for documentation
COMMENT ON COLUMN contacts.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN contacts.name_phonetic IS 'Phonetic pronunciation guide for the contact name';
