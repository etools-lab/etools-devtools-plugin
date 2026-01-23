/**
 * Base64 encoding/decoding tests
 */

import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../../../src/tools/encoding/base64';

describe('Base64 Encoding', () => {
  it('should encode simple ASCII text', () => {
    const result = base64Encode('Hello World');
    expect(result.success).toBe(true);
    expect(result.result).toBe('SGVsbG8gV29ybGQ=');
  });

  it('should encode Chinese characters', () => {
    const result = base64Encode('你好世界');
    expect(result.success).toBe(true);
    expect(result.result).toBe('5L2g5aW95LiW55WM');
  });

  it('should encode special characters', () => {
    const result = base64Encode('!@#$%^&*()');
    expect(result.success).toBe(true);
    expect(result.result).toBe('IUAjJCVeJiooKQ==');
  });

  it('should handle empty string', () => {
    const result = base64Encode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });

  it('should include metadata', () => {
    const result = base64Encode('test');
    expect(result.success).toBe(true);
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.inputLength).toBe(4);
    expect(result.metadata?.outputLength).toBeGreaterThan(0);
  });
});

describe('Base64 Decoding', () => {
  it('should decode valid Base64', () => {
    const result = base64Decode('SGVsbG8gV29ybGQ=');
    expect(result.success).toBe(true);
    expect(result.result).toBe('Hello World');
  });

  it('should decode Chinese characters', () => {
    const result = base64Decode('5L2g5aW95LiW55WM');
    expect(result.success).toBe(true);
    expect(result.result).toBe('你好世界');
  });

  it('should handle invalid Base64', () => {
    const result = base64Decode('!!!invalid!!!');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle empty string', () => {
    const result = base64Decode('');
    expect(result.success).toBe(true);
    expect(result.result).toBe('');
  });
});
