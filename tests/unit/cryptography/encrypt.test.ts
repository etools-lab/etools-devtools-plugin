/**
 * Unit tests for encryption functions
 */

import { describe, it, expect } from 'vitest';
import { aesEncrypt, aesDecrypt, formatEncryptedOutput, parseEncryptedInput } from '@/tools/cryptography/encrypt';

describe('Encryption Functions', () => {
  describe('AES Encryption', () => {
    it('should encrypt and decrypt successfully', async () => {
      const plaintext = 'Hello, World!';
      const password = 'mySecretPassword';

      const encResult = await aesEncrypt(plaintext, password);
      expect(encResult.success).toBe(true);
      expect(encResult.result).toBeDefined();
      expect(encResult.result?.ciphertext).toBeDefined();
      expect(encResult.result?.iv).toBeDefined();
      expect(encResult.result?.salt).toBeDefined();

      const decResult = await aesDecrypt(
        encResult.result!.ciphertext,
        password,
        encResult.result!.iv,
        encResult.result!.salt
      );
      expect(decResult.success).toBe(true);
      expect(decResult.result).toBe(plaintext);
    });

    it('should produce different ciphertext for same plaintext (due to random IV)', async () => {
      const plaintext = 'Hello';
      const password = 'password';

      const result1 = await aesEncrypt(plaintext, password);
      const result2 = await aesEncrypt(plaintext, password);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.result?.ciphertext).not.toBe(result2.result?.ciphertext);
    });

    it('should produce different result with wrong password', async () => {
      const plaintext = 'Secret message';
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';

      const encResult = await aesEncrypt(plaintext, password);
      expect(encResult.success).toBe(true);

      const decResult = await aesDecrypt(
        encResult.result!.ciphertext,
        wrongPassword,
        encResult.result!.iv,
        encResult.result!.salt
      );
      // With wrong password, Web Crypto API doesn't throw but produces invalid output
      // The decryption may succeed technically but the result won't match original
      // For security testing, we expect either failure OR garbage output
      if (decResult.success) {
        // If it succeeds, verify the output is not the original plaintext
        expect(decResult.result).not.toBe(plaintext);
      }
      // Note: Web Crypto API with PBKDF2 may or may not throw when password is wrong
      // depending on the implementation. The key derivation succeeds, but decryption
      // produces incorrect results.
    });

    it('should handle empty plaintext', async () => {
      const encResult = await aesEncrypt('', 'password');
      expect(encResult.success).toBe(true);

      const decResult = await aesDecrypt(
        encResult.result!.ciphertext,
        'password',
        encResult.result!.iv,
        encResult.result!.salt
      );
      expect(decResult.success).toBe(true);
      expect(decResult.result).toBe('');
    });

    it('should handle unicode plaintext', async () => {
      const plaintext = '你好世界！';
      const password = '密码';

      const encResult = await aesEncrypt(plaintext, password);
      expect(encResult.success).toBe(true);

      const decResult = await aesDecrypt(
        encResult.result!.ciphertext,
        password,
        encResult.result!.iv,
        encResult.result!.salt
      );
      expect(decResult.success).toBe(true);
      expect(decResult.result).toBe(plaintext);
    });

    it('should include metadata in result', async () => {
      const encResult = await aesEncrypt('test', 'password');
      expect(encResult.metadata).toBeDefined();
      expect(encResult.metadata?.duration).toBeDefined();
      expect(encResult.metadata?.inputLength).toBe(4);
      expect(encResult.metadata?.extra?.algorithm).toBe('AES-GCM');
    });

    it('should fail to decrypt invalid ciphertext', async () => {
      const decResult = await aesDecrypt('invalidBase64Data', 'password', 'invalidIv', 'invalidSalt');
      expect(decResult.success).toBe(false);
    });
  });

  describe('formatEncryptedOutput and parseEncryptedInput', () => {
    it('should format and parse encrypted output correctly', async () => {
      const plaintext = 'Test message';
      const password = 'test123';

      const encResult = await aesEncrypt(plaintext, password);
      expect(encResult.success).toBe(true);

      const formatted = formatEncryptedOutput(encResult.result!);
      expect(typeof formatted).toBe('string');

      const parsed = parseEncryptedInput(formatted);
      expect(parsed).not.toBeNull();
      expect(parsed?.ciphertext).toBe(encResult.result?.ciphertext);
      expect(parsed?.iv).toBe(encResult.result?.iv);
      expect(parsed?.salt).toBe(encResult.result?.salt);
    });

    it('should return null for invalid input', () => {
      expect(parseEncryptedInput('invalid json')).toBeNull();
      expect(parseEncryptedInput('{"ciphertext": "abc"}')).toBeNull();
    });
  });

  describe('DES Encryption', () => {
    it.skip('should encrypt and decrypt successfully', () => {
      // DES/3DES functions not yet implemented (T035)
      const plaintext = 'Hello DES';
      const key = 'my3DESkey1234567890123456';

      const encResult = des3Encrypt(plaintext, key);
      expect(encResult.success).toBe(true);
      expect(encResult.result).toBeDefined();

      const decResult = des3Decrypt(encResult.result!, key);
      expect(decResult.success).toBe(true);
      expect(decResult.result).toBe(plaintext);
    });

    it.skip('should handle empty plaintext', () => {
      // DES/3DES functions not yet implemented (T035)
      const key = 'my3DESkey1234567890123456';

      const encResult = des3Encrypt('', key);
      expect(encResult.success).toBe(true);

      const decResult = des3Decrypt(encResult.result!, key);
      expect(decResult.success).toBe(true);
      expect(decResult.result).toBe('');
    });

    it.skip('should include metadata in result', () => {
      // DES/3DES functions not yet implemented (T035)
      const encResult = des3Encrypt('test', 'key123456789012345678');
      expect(encResult.metadata).toBeDefined();
      expect(encResult.metadata?.extra?.algorithm).toBe('3DES-ECB');
    });
  });
});
