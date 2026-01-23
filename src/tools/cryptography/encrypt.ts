/**
 * Encryption/Decryption functions
 * Supports AES-GCM (authenticated encryption)
 */

import type { ConversionResult } from '../../types';

/**
 * Derive a key from password using PBKDF2
 */
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random IV (initialization vector)
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Generate a random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Convert string to Uint8Array
 */
function stringToBytes(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert Uint8Array to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * AES Encryption (GCM mode - authenticated encryption)
 */
export async function aesEncrypt(
  plaintext: string,
  password: string
): Promise<ConversionResult<{ ciphertext: string; iv: string; salt: string }>> {
  const startTime = performance.now();

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const salt = generateSalt();
    const iv = generateIV();

    const key = await deriveKey(password, salt);

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    const endTime = performance.now();

    return {
      success: true,
      result: {
        ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
        iv: bytesToBase64(iv),
        salt: bytesToBase64(salt),
      },
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: plaintext.length,
        extra: {
          algorithm: 'AES-GCM',
          ivLength: iv.length,
          saltLength: salt.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: plaintext.length,
      },
    };
  }
}

/**
 * AES Decryption (GCM mode - authenticated encryption)
 */
export async function aesDecrypt(
  ciphertext: string,
  password: string,
  ivBase64: string,
  saltBase64: string
): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    const encoder = new TextEncoder();
    const salt = base64ToBytes(saltBase64);
    const iv = base64ToBytes(ivBase64);
    const data = base64ToBytes(ciphertext);

    const key = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decrypted);

    const endTime = performance.now();

    return {
      success: true,
      result: plaintext,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: ciphertext.length,
        outputLength: plaintext.length,
        extra: { algorithm: 'AES-GCM' },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Decryption failed. Check your password and input. If the error persists, the data may have been tampered with.',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: ciphertext.length,
      },
    };
  }
}

/**
 * Format encrypted result for display
 */
export function formatEncryptedOutput(result: {
  ciphertext: string;
  iv: string;
  salt: string;
}): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Parse encrypted input
 */
export function parseEncryptedInput(input: string): {
  ciphertext: string;
  iv: string;
  salt: string;
} | null {
  try {
    const parsed = JSON.parse(input);
    if (parsed.ciphertext && parsed.iv && parsed.salt) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
