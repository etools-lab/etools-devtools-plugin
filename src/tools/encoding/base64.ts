import type { ConversionResult } from '../../types';

/**
 * Base64 encoding utilities
 */

/**
 * Encode text to Base64
 */
export function base64Encode(text: string): ConversionResult<string> {
  try {
    const result = btoa(unescape(encodeURIComponent(text)));
    return {
      success: true,
      result,
      metadata: {
        inputLength: text.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encoding failed',
    };
  }
}

/**
 * Decode Base64 to text
 */
export function base64Decode(encoded: string): ConversionResult<string> {
  try {
    const result = decodeURIComponent(escape(atob(encoded)));
    return {
      success: true,
      result,
      metadata: {
        inputLength: encoded.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid Base64 string',
    };
  }
}

/**
 * Encode file content to Base64
 */
export function base64EncodeFile(content: ArrayBuffer): ConversionResult<string> {
  try {
    const bytes = new Uint8Array(content);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const result = btoa(binary);
    return {
      success: true,
      result,
      metadata: {
        inputLength: bytes.byteLength,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File encoding failed',
    };
  }
}
