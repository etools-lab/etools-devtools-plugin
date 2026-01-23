/**
 * URL encoding/decoding tests
 */

import { describe, it, expect } from 'vitest';
import { urlEncode, urlDecode } from '../../../src/tools/encoding/url';

describe('URL Encoding', () => {
  it('should encode simple text', () => {
    const result = urlEncode('hello world');
    expect(result.success).toBe(true);
    expect(result.result).toBe('hello%20world');
  });

  it('should encode special characters', () => {
    const result = urlEncode('a+b=c&d=e');
    expect(result.success).toBe(true);
    expect(result.result).toBe('a%2Bb%3Dc%26d%3De');
  });

  it('should encode Chinese characters', () => {
    const result = urlEncode('你好');
    expect(result.success).toBe(true);
    expect(result.result).toBe('%E4%BD%A0%E5%A5%BD');
  });

  it('should handle empty string', () => {
    const result = urlEncode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });
});

describe('URL Decoding', () => {
  it('should decode percent-encoded text', () => {
    const result = urlDecode('hello%20world');
    expect(result.success).toBe(true);
    expect(result.result).toBe('hello world');
  });

  it('should decode special characters', () => {
    const result = urlDecode('a%2Bb%3Dc%26d%3De');
    expect(result.success).toBe(true);
    expect(result.result).toBe('a+b=c&d=e');
  });

  it('should decode Chinese characters', () => {
    const result = urlDecode('%E4%BD%A0%E5%A5%BD');
    expect(result.success).toBe(true);
    expect(result.result).toBe('你好');
  });

  it('should handle empty string', () => {
    const result = urlDecode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });
});
