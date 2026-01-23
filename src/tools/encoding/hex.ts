import type { ConversionResult } from '../../types';

/**
 * Hex encoding utilities
 */

/**
 * Convert text to hex bytes
 */
export function hexEncode(text: string): ConversionResult<string> {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hexArray = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0'));
    const result = hexArray.join(' ');
    return {
      success: true,
      result,
      metadata: {
        inputLength: text.length,
        outputLength: bytes.length,
        extra: { byteCount: bytes.length },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hex encoding failed',
    };
  }
}

/**
 * Convert hex bytes to text
 */
export function hexDecode(hex: string): ConversionResult<string> {
  try {
    // Remove spaces and validate hex
    const cleanHex = hex.replace(/\s+/g, '').toLowerCase();
    if (!/^[0-9a-f]*$/.test(cleanHex)) {
      throw new Error('Invalid hex string');
    }
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string must have even length');
    }

    const bytes: number[] = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.slice(i, i + 2), 16));
    }

    const decoder = new TextDecoder();
    const result = decoder.decode(new Uint8Array(bytes));
    return {
      success: true,
      result,
      metadata: {
        inputLength: cleanHex.length,
        outputLength: result.length,
        extra: { byteCount: bytes.length },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hex decoding failed',
    };
  }
}

/**
 * Convert raw bytes to hex string (compact, no spaces)
 */
export function hexEncodeCompact(text: string): ConversionResult<string> {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const result = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return {
      success: true,
      result,
      metadata: {
        inputLength: text.length,
        outputLength: bytes.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hex encoding failed',
    };
  }
}

/**
 * Convert hex string to raw bytes
 */
export function hexDecodeCompact(hex: string): ConversionResult<Uint8Array> {
  try {
    const cleanHex = hex.replace(/\s+/g, '').toLowerCase();
    if (!/^[0-9a-f]*$/.test(cleanHex)) {
      throw new Error('Invalid hex string');
    }
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string must have even length');
    }

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
    }

    return {
      success: true,
      result: bytes,
      metadata: {
        inputLength: cleanHex.length,
        outputLength: bytes.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hex decoding failed',
    };
  }
}
