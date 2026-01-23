/**
 * Validation utilities for developer tools
 */

/**
 * Check if a string is valid JSON
 */
export function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate and parse JSON with detailed error information
 */
export function validateJSON(input: string): {
  valid: boolean;
  error?: string;
  position?: number;
  line?: number;
  column?: number;
} {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';

    // Try to extract position from error message
    const positionMatch = message.match(/position\s+(\d+)/i);
    const lineMatch = message.match(/line\s+(\d+)/i);
    const columnMatch = message.match(/column\s+(\d+)/i);

    return {
      valid: false,
      error: message,
      position: positionMatch ? parseInt(positionMatch[1], 10) : undefined,
      line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
      column: columnMatch ? parseInt(columnMatch[1], 10) : undefined,
    };
  }
}

/**
 * Check if a string is valid Base64
 */
export function isValidBase64(input: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(input)) return false;
  if (input.length % 4 !== 0) return false;

  try {
    decodeURIComponent(escape(atob(input)));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is valid URL-encoded
 */
export function isValidURLEncoded(input: string): boolean {
  try {
    const decoded = decodeURIComponent(input);
    // Check if it was properly encoded
    return encodeURIComponent(decoded) === input;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid timestamp (seconds or milliseconds)
 */
export function isValidTimestamp(input: string): boolean {
  const num = parseInt(input, 10);
  if (isNaN(num)) return false;

  // Reasonable timestamp range: 2000-01-01 to 2100-12-31
  const minTimestamp = 946684800; // 2000-01-01 in seconds
  const maxTimestamp = 4102444800; // 2100-12-31 in seconds

  const tsInSeconds = input.length <= 10 ? num : Math.floor(num / 1000);
  return tsInSeconds >= minTimestamp && tsInSeconds <= maxTimestamp;
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(input: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input);
}

/**
 * Check if a string is valid hex color
 */
export function isValidHexColor(input: string): boolean {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(input);
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

/**
 * Check if a string is a valid URL
 */
export function isValidURL(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string contains only printable ASCII characters
 */
export function isASCII(input: string): boolean {
  return /^[\x20-\x7E]*$/.test(input);
}

/**
 * Check if a string is a valid IP address (IPv4)
 */
export function isValidIPv4(input: string): boolean {
  const parts = input.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

/**
 * Check if a string is a valid MAC address
 */
export function isValidMAC(input: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(input);
}
