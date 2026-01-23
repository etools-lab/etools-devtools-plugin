/**
 * Bcrypt hash functions
 * Uses bcryptjs library for password hashing and verification
 */

import type { ConversionResult } from '../../types';
import * as bcrypt from 'bcryptjs';

export const DEFAULT_ROUNDS = 10;

/**
 * Generate bcrypt hash from password
 */
export async function bcryptHash(
  password: string,
  rounds: number = DEFAULT_ROUNDS
): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    // bcrypt.hash is synchronous but we wrap it in a promise for consistency
    const hash = await bcrypt.hash(password, rounds);

    const endTime = performance.now();

    return {
      success: true,
      result: hash,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: password.length,
        outputLength: hash.length,
        extra: { rounds },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hashing failed',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: password.length,
      },
    };
  }
}

/**
 * Verify bcrypt hash against password
 */
export async function bcryptVerify(
  password: string,
  hash: string
): Promise<ConversionResult<boolean>> {
  const startTime = performance.now();

  try {
    const isValid = await bcrypt.compare(password, hash);

    const endTime = performance.now();

    return {
      success: true,
      result: isValid,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: password.length,
        hashLength: hash.length,
        extra: { isValid },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: password.length,
      },
    };
  }
}

/**
 * Check if a string is a valid bcrypt hash format
 */
export function isValidBcryptHash(hash: string): boolean {
  // Bcrypt hashes start with $2a$, $2b$, or $2y$ followed by cost factor
  const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
  return bcryptRegex.test(hash);
}

/**
 * Generate a salt for bcrypt
 */
export async function bcryptGenSalt(rounds: number = DEFAULT_ROUNDS): Promise<string> {
  return bcrypt.genSalt(rounds);
}

/**
 * Get hash info (algorithm and cost factor)
 */
export function getBcryptInfo(hash: string): { algorithm: string; cost: number } | null {
  if (!isValidBcryptHash(hash)) {
    return null;
  }

  const parts = hash.split('$');
  const algorithm = parts[1].toUpperCase();
  const cost = parseInt(parts[2], 10);

  return { algorithm, cost };
}
