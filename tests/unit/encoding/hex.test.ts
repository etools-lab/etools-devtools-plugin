/**
 * Hex encoding/decoding tests
 */

import { describe, it, expect } from 'vitest';
import { hexEncode, hexDecode } from '../../../src/tools/encoding/hex';

describe('Hex Encoding', () => {
  it('should encode ASCII text to hex', () => {
    const result = hexEncode('Hello');
    expect(result.success).toBe(true);
    expect(result.result).toBe('48 65 6c 6c 6f');
  });

  it('should encode Chinese characters', () => {
    const result = hexEncode('你好');
    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
    // Chinese characters are 3 bytes each in UTF-8
    expect(result.result?.split(' ').length).toBe(6);
  });

  it('should handle empty string', () => {
    const result = hexEncode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });

  it('should include metadata with byte count', () => {
    const result = hexEncode('test');
    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.inputLength).toBe(4);
    expect(result.metadata?.extra?.byteCount).toBe(4);
  });
});

describe('Hex Decoding', () => {
  it('should decode hex to text', () => {
    const result = hexDecode('48 65 6c 6c 6f');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello');
  });

  it('should decode hex without spaces', () => {
    const result = hexDecode('48656c6c6f');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello');
  });

  it('should handle uppercase hex', () => {
    const result = hexDecode('48 65 6C 6C 6F');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello');
  });

  it('should fail on invalid hex', () => {
    const result = hexDecode('!!!');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should fail on odd length hex', () => {
    const result = hexDecode('48656c6c0'); // 9 characters (odd)
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle empty string', () => {
    const result = hexDecode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });
});
