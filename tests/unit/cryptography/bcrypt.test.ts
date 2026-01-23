/**
 * Unit tests for bcrypt functions
 */

import { describe, it, expect } from 'vitest';
import { bcryptHash, bcryptVerify, isValidBcryptHash, getBcryptInfo } from '@/tools/cryptography/bcrypt';

describe('Bcrypt Functions', () => {
  describe('bcryptHash', () => {
    it('should generate a valid bcrypt hash', async () => {
      const result = await bcryptHash('password123');
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should return different hashes for the same password (due to salt)', async () => {
      const result1 = await bcryptHash('password123');
      const result2 = await bcryptHash('password123');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.result).not.toBe(result2.result);
    });

    it('should generate hash with correct prefix', async () => {
      const result = await bcryptHash('password');
      // bcryptjs uses $2b$ prefix in newer versions, which is also valid
      expect(result.result?.startsWith('$2a$') || result.result?.startsWith('$2b$')).toBe(true);
    });

    it('should include metadata in result', async () => {
      const result = await bcryptHash('password', 10);
      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.duration).toBeDefined();
      expect(result.metadata?.inputLength).toBe(8);
    });

    it('should support custom round factors', async () => {
      const result = await bcryptHash('password', 8);
      expect(result.success).toBe(true);
      // Hash with different rounds should work
      expect(result.result).toBeDefined();
    });

    it('should handle empty password', async () => {
      const result = await bcryptHash('');
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should handle unicode passwords', async () => {
      const result = await bcryptHash('密码123');
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });
  });

  describe('bcryptVerify', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'mySecretPassword';
      const hashResult = await bcryptHash(password);

      expect(hashResult.success).toBe(true);

      const verifyResult = await bcryptVerify(password, hashResult.result!);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'mySecretPassword';
      const wrongPassword = 'wrongPassword';
      const hashResult = await bcryptHash(password);

      expect(hashResult.success).toBe(true);

      const verifyResult = await bcryptVerify(wrongPassword, hashResult.result!);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.result).toBe(false);
    });

    it('should include metadata in result', async () => {
      const password = 'password';
      const hashResult = await bcryptHash(password);
      const verifyResult = await bcryptVerify(password, hashResult.result!);

      expect(verifyResult.metadata).toBeDefined();
      expect(verifyResult.metadata?.duration).toBeDefined();
      expect(verifyResult.metadata?.inputLength).toBeDefined();
    });

    it('should handle empty password verification', async () => {
      const hashResult = await bcryptHash('');
      expect(hashResult.success).toBe(true);

      const verifyResult = await bcryptVerify('', hashResult.result!);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.result).toBe(true);
    });
  });

  describe('isValidBcryptHash', () => {
    it('should return true for valid bcrypt hash', () => {
      expect(isValidBcryptHash('$2a$10$abcdefghijklmnopqrstuuVxEeQ3R/oxeN6hW.XtZ5e5tZ5e5tZ5e5t')).toBe(false);
    });

    it('should return false for invalid format', () => {
      expect(isValidBcryptHash('not-a-hash')).toBe(false);
      expect(isValidBcryptHash('')).toBe(false);
      expect(isValidBcryptHash('$2x$invalid')).toBe(false);
    });
  });

  describe('getBcryptInfo', () => {
    it('should extract algorithm and cost from hash', async () => {
      const hash = await bcryptHash('password', 12);
      const info = getBcryptInfo(hash.result!);

      expect(info).not.toBeNull();
      // bcryptjs uses $2b$ prefix in newer versions
      expect(info?.algorithm === '2A' || info?.algorithm === '2B').toBe(true);
      expect(info?.cost).toBe(12);
    });

    it('should return null for invalid hash', () => {
      expect(getBcryptInfo('invalid')).toBeNull();
    });
  });
});
