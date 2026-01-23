/**
 * Unicode encoding/decoding tests
 */

import { describe, it, expect } from 'vitest';
import { unicodeEncode, unicodeDecode } from '../../../src/tools/encoding/unicode';

describe('Unicode Encoding', () => {
  it('should encode ASCII text to unicode escape format', () => {
    const result = unicodeEncode('Hello');
    expect(result.success).toBe(true);
    expect(result.result).toBe('\\u0048\\u0065\\u006c\\u006c\\u006f');
  });

  it('should encode Chinese characters', () => {
    const result = unicodeEncode('你好');
    expect(result.success).toBe(true);
    expect(result.result).toBe('\\u4f60\\u597d');
  });

  it('should encode emoji', () => {
    const result = unicodeEncode('😀');
    expect(result.success).toBe(true);
    // Emoji may be encoded as surrogate pair
    expect(result.result).toBeDefined();
    expect(result.result?.length).toBeGreaterThan(0);
  });

  it('should handle empty string', () => {
    const result = unicodeEncode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });

  it('should include metadata', () => {
    const result = unicodeEncode('test');
    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.inputLength).toBe(4);
    expect(result.metadata?.outputLength).toBeGreaterThan(4);
  });
});

describe('Unicode Decoding', () => {
  it('should decode unicode escape format', () => {
    const result = unicodeDecode('\\u0048\\u0065\\u006c\\u006c\\u006f');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello');
  });

  it('should decode Chinese characters', () => {
    const result = unicodeDecode('\\u4f60\\u597d');
    expect(result.success).toBe(true);
    expect(result.result).toBe('你好');
  });

  it('should handle mixed content', () => {
    const result = unicodeDecode('Hello\\u4f60\\u597dWorld');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello你好World');
  });

  it('should handle empty string', () => {
    const result = unicodeDecode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });
});
