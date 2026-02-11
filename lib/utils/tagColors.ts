/**
 * Tag color utility with deterministic color assignment
 *
 * Uses a hash function to consistently assign colors to tag names,
 * ensuring the same tag always gets the same color across the app.
 */

// Tag color palette - subtle tinted backgrounds with white text
// Each color has: background (30% opacity), border, and text color
const TAG_PALETTE = [
  {
    name: 'indigo',
    bg: 'rgba(91, 91, 214, 0.3)',
    border: 'rgba(91, 91, 214, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'green',
    bg: 'rgba(48, 164, 108, 0.3)',
    border: 'rgba(48, 164, 108, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'amber',
    bg: 'rgba(240, 158, 0, 0.3)',
    border: 'rgba(240, 158, 0, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'red',
    bg: 'rgba(229, 72, 77, 0.3)',
    border: 'rgba(229, 72, 77, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'blue',
    bg: 'rgba(99, 179, 237, 0.3)',
    border: 'rgba(99, 179, 237, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'purple',
    bg: 'rgba(167, 139, 250, 0.3)',
    border: 'rgba(167, 139, 250, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'pink',
    bg: 'rgba(236, 72, 153, 0.3)',
    border: 'rgba(236, 72, 153, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
  {
    name: 'teal',
    bg: 'rgba(45, 212, 191, 0.3)',
    border: 'rgba(45, 212, 191, 0.5)',
    text: 'rgba(255, 255, 255, 0.95)',
  },
];

export interface TagColor {
  bg: string;
  border: string;
  text: string;
  name: string;
}

/**
 * Simple hash function to convert string to number
 * Uses djb2 algorithm for consistent hashing
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Get consistent color for a tag name
 * Same tag name will always return the same color
 *
 * @param tagName - The tag name to get color for
 * @returns TagColor object with bg, border, and text colors
 */
export function getTagColor(tagName: string): TagColor {
  const hash = hashString(tagName.toLowerCase().trim());
  const index = hash % TAG_PALETTE.length;
  return TAG_PALETTE[index] as TagColor;
}

/**
 * Get Tailwind-compatible inline styles for a tag
 *
 * @param tagName - The tag name to style
 * @returns CSS style object for inline styling
 */
export function getTagStyles(tagName: string): React.CSSProperties {
  const color = getTagColor(tagName);
  return {
    backgroundColor: color.bg,
    borderColor: color.border,
    color: color.text,
  };
}

/**
 * Get all available tag colors (useful for previews/legends)
 */
export function getAllTagColors(): TagColor[] {
  return [...TAG_PALETTE];
}
