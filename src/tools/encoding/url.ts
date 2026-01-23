import type { ConversionResult } from '../../types';

/**
 * URL encoding utilities
 */

/**
 * Encode text for URL components
 */
export function urlEncode(text: string): ConversionResult<string> {
  try {
    const result = encodeURIComponent(text);
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
      error: error instanceof Error ? error.message : 'URL encoding failed',
    };
  }
}

/**
 * Decode URL-encoded text
 */
export function urlDecode(encoded: string): ConversionResult<string> {
  try {
    const result = decodeURIComponent(encoded);
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
      error: 'Invalid URL encoding',
    };
  }
}

/**
 * Encode entire URL (preserving structure)
 */
export function urlEncodeFull(url: string): ConversionResult<string> {
  try {
    const result = encodeURI(url);
    return {
      success: true,
      result,
      metadata: {
        inputLength: url.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'URL encoding failed',
    };
  }
}
