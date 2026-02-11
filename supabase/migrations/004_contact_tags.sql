-- Add tags field to contacts (array of strings, max 3 tags)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add a check constraint to limit tags to 3
ALTER TABLE contacts ADD CONSTRAINT tags_max_three CHECK (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 3);
