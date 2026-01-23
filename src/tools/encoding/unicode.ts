import type { ConversionResult } from '../../types';

/**
 * Unicode encoding utilities
 */

/**
 * Convert text to Unicode escape format (\uXXXX)
 */
export function unicodeEncode(text: string): ConversionResult<string> {
  try {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (charCode <= 0xff) {
        result += `\\u${charCode.toString(16).padStart(4, '0')}`;
      } else {
        // Handle surrogate pairs
        if (charCode >= 0xd800 && charCode <= 0xdbff && i + 1 < text.length) {
          const nextCharCode = text.charCodeAt(i + 1);
          if (nextCharCode >= 0xdc00 && nextCharCode <= 0xdfff) {
            const codePoint = 0x10000 + ((charCode - 0xd800) * 0x400) + (nextCharCode - 0xdc00);
            result += `\\u${codePoint.toString(16).padStart(4, '0')}`;
            i++;
            continue;
          }
        }
        result += `\\u${charCode.toString(16).padStart(4, '0')}`;
      }
    }
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
      error: error instanceof Error ? error.message : 'Unicode encoding failed',
    };
  }
}

/**
 * Convert Unicode escape format to text
 */
export function unicodeDecode(encoded: string): ConversionResult<string> {
  try {
    // Handle \uXXXX and \u{XXXXX} formats
    const result = encoded.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    }).replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => {
      return String.fromCodePoint(parseInt(hex, 16));
    });
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
      error: 'Invalid Unicode escape sequence',
    };
  }
}

/**
 * Convert text to JSON Unicode format (with escapes for special chars)
 */
export function unicodeEncodeJson(text: string): ConversionResult<string> {
  try {
    const result = JSON.stringify(text).slice(1, -1); // Remove quotes
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
      error: error instanceof Error ? error.message : 'Unicode JSON encoding failed',
    };
  }
}
