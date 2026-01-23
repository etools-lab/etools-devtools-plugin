/**
 * Helper functions for developer tools
 */

/**
 * Generate a random string of specified length
 */
export function randomString(length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Truncate a string to specified length with ellipsis
 */
export function truncate(str: string, maxLength: number, ellipsis = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Convert string to binary representation
 */
export function stringToBinary(str: string): string {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

/**
 * Convert binary string to text
 */
export function binaryToString(binary: string): string {
  return binary
    .split(' ')
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join('');
}

/**
 * Remove all whitespace from a string
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Remove all line breaks from a string
 */
export function removeLineBreaks(str: string): string {
  return str.replace(/[\r\n]/g, '');
}

/**
 * Normalize line endings to LF
 */
export function normalizeLineEndings(str: string): string {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Count lines in a string
 */
export function countLines(str: string): number {
  return str.split('\n').length;
}

/**
 * Get line at specified index (0-based)
 */
export function getLine(str: string, lineIndex: number): string | null {
  const lines = str.split('\n');
  if (lineIndex < 0 || lineIndex >= lines.length) return null;
  return lines[lineIndex];
}

/**
 * Escape HTML special characters
 */
export function escapeHTML(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHTML(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, (entity) => htmlUnescapes[entity]);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * Reverse a string
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Repeat a string n times
 */
export function repeatString(str: string, times: number): string {
  return str.repeat(times);
}

/**
 * Pad a string to specified length
 */
export function padString(str: string, length: number, char = ' '): string {
  if (str.length >= length) return str;
  return char.repeat(length - str.length) + str;
}

/**
 * Convert a string to its byte representation
 */
export function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}

/**
 * Convert bytes to string
 */
export function bytesToString(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

/**
 * Check if a string is palindrome
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
