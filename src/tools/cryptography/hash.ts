/**
 * Cryptographic hash functions
 * Supports MD5, SHA-1, SHA-256, SHA-512, and SM3
 */

import type { ConversionResult } from '../../types';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'sm3';

/**
 * Generate hash using Web Crypto API for supported algorithms
 */
async function generateWebCryptoHash(
  text: string,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512'
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * MD5 hash implementation (pure JS, not available in Web Crypto API)
 */
function md5Hash(text: string): string {
  // MD5 functions
  function md5cycle(x: number[], k: number[]) {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = (a + x[0]) | 0;
    x[1] = (b + x[1]) | 0;
    x[2] = (c + x[2]) | 0;
    x[3] = (d + x[3]) | 0;
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = ((a + q) | 0) + (((x + t) | 0) | 0) | 0;
    a = (a << s) | (a >>> (32 - s));
    a = (a + b) | 0;
    return a;
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(((b & c) | (~b & d)) | 0, a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(((b & d) | (c & ~d)) | 0, a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md5blk(bytes: number[]) {
    const md5blks: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
    }
    return md5blks;
  }

  const hexChars = '0123456789abcdef';

  function rhex(n: number) {
    let s = '';
    for (let j = 0; j < 4; j++) {
      s += hexChars.charAt((n >> (j * 8 + 4)) & 0x0f) + hexChars.charAt((n >> (j * 8)) & 0x0f);
    }
    return s;
  }

  function hex(x: number[]) {
    return x.map(rhex).join('');
  }

  const safeAdd = (x: number, y: number) => {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  };

  // Convert string to UTF-8 bytes
  const str2utf8 = (str: string) => {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else if (c < 2048) {
        bytes.push((c >> 6) | 192);
        bytes.push((c & 63) | 128);
      } else {
        bytes.push((c >> 12) | 224);
        bytes.push(((c >> 6) & 63) | 128);
        bytes.push((c & 63) | 128);
      }
    }
    return bytes;
  };

  // Main MD5 algorithm
  const bytes = str2utf8(text);
  const state = [1732584193, -271733879, -1732584194, 271733878];

  // Append padding
  const paddedBytes = [...bytes];
  paddedBytes.push(0x80);
  while (paddedBytes.length % 64 !== 56) {
    paddedBytes.push(0);
  }

  // Append length (in bits, little-endian)
  const totalBits = bytes.length * 8;
  paddedBytes.push(totalBits & 0xff);
  paddedBytes.push((totalBits >> 8) & 0xff);
  paddedBytes.push((totalBits >> 16) & 0xff);
  paddedBytes.push((totalBits >> 24) & 0xff);

  for (let chunk = 0; chunk < paddedBytes.length; chunk += 64) {
    const x = md5blk(paddedBytes.slice(chunk, chunk + 64));
    const olda = state[0];
    const oldb = state[1];
    const oldc = state[2];
    const oldd = state[3];
    md5cycle(state, x);
    state[0] = safeAdd(state[0], olda);
    state[1] = safeAdd(state[1], oldb);
    state[2] = safeAdd(state[2], oldc);
    state[3] = safeAdd(state[3], oldd);
  }

  return hex(state);
}

/**
 * SM3 hash implementation (Chinese national standard algorithm)
 */
function sm3Hash(text: string): string {
  // SM3 constants
  const T = [
    0x79cc4519, 0xf3988a32, 0xe7311465, 0xce6228cb, 0x9cc45197, 0x3988a32e, 0x7311465c, 0xe6228cbc,
    0xcc451979, 0x988a32e7, 0x311465ce, 0x6228cbcc, 0xc451979c, 0x451979cc, 0x51979cc4, 0x1979cc45,
    0x979cc451, 0x79cc4519, 0xf3988a32, 0xe7311465, 0xce6228cb, 0x9cc45197, 0x3988a32e, 0x7311465c,
    0xe6228cbc, 0xc451979c, 0x5145979c, 0x145979cc, 0x45979cc4, 0x5979cc45, 0x979cc451, 0x79cc4519,
    0xf3988a32, 0xe7311465, 0xce6228cb, 0x9cc45197, 0x3988a32e, 0x7311465c, 0xe6228cbc, 0xc451979c,
    0x5145979c, 0x145979cc, 0x45979cc4, 0x5979cc45, 0x979cc451, 0x79cc4519, 0xf3988a32, 0xe7311465,
    0xce6228cb, 0x9cc45197, 0x3988a32e, 0x7311465c, 0xe6228cbc, 0xc451979c, 0x5145979c, 0x145979cc,
    0x45979cc4, 0x5979cc45, 0x979cc451, 0x79cc4519, 0xf3988a32, 0xe7311465, 0xce6228cb, 0x9cc45197,
  ];

  // Convert string to UTF-8 bytes
  const str2bytes = (str: string) => {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c < 128) {
        bytes.push(c);
      } else if (c < 2048) {
        bytes.push((c >> 6) | 192);
        bytes.push((c & 63) | 128);
      } else {
        bytes.push((c >> 12) | 224);
        bytes.push(((c >> 6) & 63) | 128);
        bytes.push((c & 63) | 128);
      }
    }
    return bytes;
  };

  function rotl(x: number, n: number) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }

  function p0(x: number) {
    return x ^ rotl(x, 9) ^ rotl(x, 17);
  }

  function p1(x: number) {
    return x ^ rotl(x, 15) ^ rotl(x, 23);
  }

  function ff0(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }

  function ff1(x: number, y: number, z: number) {
    return (x & y) | (x & z) | (y & z);
  }

  function gg0(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }

  function gg1(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }

  // Initialize state
  let v = [
    0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e,
  ];

  // Get message bytes
  const msg = str2bytes(text);
  const totalBits = msg.length * 8;

  // Append padding
  msg.push(0x80);
  while (msg.length % 64 !== 56) {
    msg.push(0);
  }

  // Append length (big-endian)
  msg.push((totalBits >> 56) & 0xff);
  msg.push((totalBits >> 48) & 0xff);
  msg.push((totalBits >> 40) & 0xff);
  msg.push((totalBits >> 32) & 0xff);
  msg.push((totalBits >> 24) & 0xff);
  msg.push((totalBits >> 16) & 0xff);
  msg.push((totalBits >> 8) & 0xff);
  msg.push(totalBits & 0xff);

  // Process in 512-bit blocks
  for (let i = 0; i < msg.length; i += 64) {
    const m = msg.slice(i, i + 64).map((v) => (v < 0 ? v + 256 : v));

    // Expand message
    const w: number[] = [];
    for (let j = 0; j < 16; j++) {
      w[j] = (m[j * 4] << 24) | (m[j * 4 + 1] << 16) | (m[j * 4 + 2] << 8) | m[j * 4 + 3];
    }
    for (let j = 16; j < 68; j++) {
      const p1 = w[j - 16] ^ w[j - 9] ^ rotl(w[j - 3], 15);
      w[j] = p1 ^ rotl(w[j - 13], 7) ^ w[j - 6];
    }
    for (let j = 0; j < 64; j++) {
      w[j + 68] = w[j] ^ w[j + 4];
    }

    // Compression
    const oldv = [...v];
    for (let j = 0; j < 64; j++) {
      const ss1 = rotl((rotl(oldv[0], 12) + oldv[4] + rotl(T[j], j)) >>> 0, 7);
      const ss2 = ss1 ^ rotl(oldv[0], 12);
      let tt1: number, tt2: number;

      if (j < 16) {
        tt1 = (ff0(oldv[0], oldv[1], oldv[2]) + oldv[3] + ss2 + w[j + 68]) >>> 0;
        tt2 = (gg0(oldv[4], oldv[5], oldv[6]) + oldv[7] + ss1 + w[j]) >>> 0;
      } else {
        tt1 = (ff1(oldv[0], oldv[1], oldv[2]) + oldv[3] + ss2 + w[j + 68]) >>> 0;
        tt2 = (gg1(oldv[4], oldv[5], oldv[6]) + oldv[7] + ss1 + w[j]) >>> 0;
      }

      oldv[3] = oldv[2];
      oldv[2] = rotl(oldv[1], 9);
      oldv[1] = rotl(oldv[0], 19);
      oldv[0] = (p0(tt1) ^ oldv[0]) >>> 0;
      oldv[4] = oldv[3];
      oldv[3] = oldv[2];
      oldv[2] = rotl(oldv[1], 9);
      oldv[1] = rotl(oldv[0], 19);
      oldv[4] = (p0(tt2) ^ oldv[4]) >>> 0;
    }

    v[0] = (v[0] ^ oldv[0]) >>> 0;
    v[1] = (v[1] ^ oldv[1]) >>> 0;
    v[2] = (v[2] ^ oldv[2]) >>> 0;
    v[3] = (v[3] ^ oldv[3]) >>> 0;
    v[4] = (v[4] ^ oldv[4]) >>> 0;
    v[5] = (v[5] ^ oldv[5]) >>> 0;
    v[6] = (v[6] ^ oldv[6]) >>> 0;
    v[7] = (v[7] ^ oldv[7]) >>> 0;
  }

  // Output hash as hex string
  return v.map((word) => word.toString(16).padStart(8, '0')).join('');
}

/**
 * Generate hash using the specified algorithm
 */
export async function generateHash(text: string, algorithm: HashAlgorithm): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    let hash: string;

    switch (algorithm) {
      case 'md5':
        hash = md5Hash(text);
        break;
      case 'sha1':
        hash = await generateWebCryptoHash(text, 'SHA-1');
        break;
      case 'sha256':
        hash = await generateWebCryptoHash(text, 'SHA-256');
        break;
      case 'sha512':
        hash = await generateWebCryptoHash(text, 'SHA-512');
        break;
      case 'sm3':
        hash = sm3Hash(text);
        break;
      default:
        throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }

    const endTime = performance.now();

    return {
      success: true,
      result: hash,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: hash.length,
        extra: { algorithm },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Generate MD5 hash (synchronous, for compatibility)
 */
export function generateMD5(text: string): string {
  return md5Hash(text);
}

/**
 * Generate SHA-1 hash
 */
export async function generateSHA1(text: string): Promise<string> {
  return generateWebCryptoHash(text, 'SHA-1');
}

/**
 * Generate SHA-256 hash
 */
export async function generateSHA256(text: string): Promise<string> {
  return generateWebCryptoHash(text, 'SHA-256');
}

/**
 * Generate SHA-512 hash
 */
export async function generateSHA512(text: string): Promise<string> {
  return generateWebCryptoHash(text, 'SHA-512');
}

/**
 * Generate SM3 hash
 */
export function generateSM3(text: string): string {
  return sm3Hash(text);
}
