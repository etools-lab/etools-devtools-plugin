/**
 * ETools Developer Tools Plugin
 *
 * A collection of useful developer utilities:
 * - JSON formatter and validator
 * - Base64 encoder/decoder
 * - URL encoder/decoder
 * - Unicode encoder/decoder
 * - Hex encoder/decoder
 * - Hash generator (MD5, SHA-1, SHA-256, SHA-512, SM3)
 * - AES encryption/decryption
 * - Bcrypt password hashing/verification
 * - Timestamp converter
 * - UUID generator
 */

import type {
  PluginV2,
  PluginManifest,
  PluginSearchResultV2,
} from './types';
import { DevToolsUI } from './ui';
import { base64Encode, base64Decode } from './tools/encoding/base64';
import { urlEncode, urlDecode } from './tools/encoding/url';
import { unicodeEncode, unicodeDecode } from './tools/encoding/unicode';
import { hexEncode, hexDecode } from './tools/encoding/hex';
import { generateHash } from './tools/cryptography/hash';
import { aesEncrypt, aesDecrypt } from './tools/cryptography/encrypt';
import { bcryptHash, bcryptVerify } from './tools/cryptography/bcrypt';
import {
  jsonFormat,
  jsonValidate,
  jsonToCsv,
  jsonToGetParams,
  jsonEscape,
  jsonUnescape,
} from './tools/developer/json';
import { sqlFormat } from './tools/developer/sql';
import { yamlFormat } from './tools/developer/yaml';
import { xmlFormat } from './tools/developer/xml';
import { testRegex, replaceRegex, explainRegex, formatMatchGroups } from './tools/developer/regex';
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
  getRelativeTime,
  parseNaturalLanguage,
} from './tools/time/timestamp';

export const manifest: PluginManifest = {
  id: 'devtools',
  name: 'Developer Tools',
  version: '1.2.0',
  description: 'Developer utilities - JSON formatter, Base64, URL encode, hash generator, AES encryption, bcrypt, timestamp converter, UUID',
  author: 'ETools Team',
  permissions: ['write:clipboard'],
  triggers: [
    'dev:',
    'json:',
    'base64:',
    'url:',
    'unicode:',
    'hex:',
    'hash:',
    'aes:',
    'bcrypt:',
    'sm3:',
    'ts:',
    'time:',
    'date:',
    'uuid:',
    'sql:',
    'yaml:',
    'xml:',
    'regex:',
    're:',
    'qr:',
    'barcode:',
    'pinyin:',
    's2t:',
    't2s:',
    'ui:',
  ],
  icon: '🛠️',
};

// Utility functions

function formatJSON(json: string): { success: boolean; result?: string; error?: string } {
  try {
    const parsed = JSON.parse(json);
    return {
      success: true,
      result: JSON.stringify(parsed, null, 2),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

async function generateHash(text: string, algorithm: 'md5' | 'sha-1' | 'sha-256'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  let algo: string;
  switch (algorithm) {
    case 'md5':
      // MD5 is not supported by SubtleCrypto, using a simple fallback
      return simpleHash(text);
    case 'sha-1':
      algo = 'SHA-1';
      break;
    case 'sha-256':
      algo = 'SHA-256';
      break;
  }

  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function convertTimestamp(timestamp: string): { success: boolean; result?: string; error?: string } {
  try {
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      return { success: false, error: 'Invalid timestamp' };
    }

    // Handle both seconds and milliseconds
    const date = ts.toString().length <= 10 ? new Date(ts * 1000) : new Date(ts);

    return {
      success: true,
      result: date.toLocaleString(),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid timestamp',
    };
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Main search function

export async function onSearch(query: string): Promise<PluginSearchResultV2[]> {
  const results: PluginSearchResultV2[] = [];

  // Remove trigger prefix
  const cleanQuery = query.replace(
    /^(dev:|json:|base64:|url:|unicode:|hex:|hash:|aes:|bcrypt:|sm3:|ts:|time:|date:|uuid:|sql:|yaml:|xml:|regex:|re:|qr:|barcode:|pinyin:|s2t:|t2s:)/,
    ''
  ).trim();

  // UI trigger - 显示打开 UI 的选项
  if (query.startsWith('ui:devtools') || query === 'ui:') {
    results.push({
      id: 'open-ui',
      title: '开发者工具界面',
      description: '打开可视化开发者工具界面',
      icon: '🛠️',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
      },
    });
  }

  // JSON formatter
  if (query.startsWith('json:') || query.startsWith('dev:')) {
    results.push({
      id: 'json-format',
      title: 'JSON Formatter',
      description: 'Format and validate JSON',
      icon: '📋',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'json-format',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'json-validate',
      title: 'JSON Validate',
      description: 'Validate JSON with error location',
      icon: '✅',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'json-validate',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'json-to-csv',
      title: 'JSON to CSV',
      description: 'Convert JSON array to CSV',
      icon: '📊',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'json-to-csv',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'json-to-get',
      title: 'JSON to GET',
      description: 'Convert JSON to URL parameters',
      icon: '🔗',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'json-to-get',
        query: cleanQuery,
      },
    });
  }

  // Base64 tools
  if (query.startsWith('base64:') || query.startsWith('dev:')) {
    results.push({
      id: 'base64-encode',
      title: 'Base64 Encode',
      description: 'Encode text to Base64',
      icon: '🔐',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'base64-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'base64-decode',
      title: 'Base64 Decode',
      description: 'Decode Base64 to text',
      icon: '🔓',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'base64-decode',
        query: cleanQuery,
      },
    });
  }

  // URL tools
  if (query.startsWith('url:') || query.startsWith('dev:')) {
    results.push({
      id: 'url-encode',
      title: 'URL Encode',
      description: 'Encode URL components',
      icon: '🔗',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'url-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'url-decode',
      title: 'URL Decode',
      description: 'Decode URL components',
      icon: '🔗',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'url-decode',
        query: cleanQuery,
      },
    });
  }

  // Unicode tools
  if (query.startsWith('unicode:') || query.startsWith('dev:')) {
    results.push({
      id: 'unicode-encode',
      title: 'Unicode Encode',
      description: 'Convert text to \\uXXXX format',
      icon: '🔤',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'unicode-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'unicode-decode',
      title: 'Unicode Decode',
      description: 'Convert \\uXXXX format to text',
      icon: '🔤',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'unicode-decode',
        query: cleanQuery,
      },
    });
  }

  // Hex tools
  if (query.startsWith('hex:') || query.startsWith('dev:')) {
    results.push({
      id: 'hex-encode',
      title: 'Hex Encode',
      description: 'Convert text to hex bytes',
      icon: '🔢',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hex-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hex-decode',
      title: 'Hex Decode',
      description: 'Convert hex bytes to text',
      icon: '🔢',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hex-decode',
        query: cleanQuery,
      },
    });
  }

  // Hash generator
  if (query.startsWith('hash:') || query.startsWith('sm3:') || query.startsWith('dev:')) {
    results.push({
      id: 'hash-md5',
      title: 'Generate MD5 Hash',
      description: `Generate MD5 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hash-md5',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sha1',
      title: 'Generate SHA-1 Hash',
      description: `Generate SHA-1 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hash-sha1',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sha256',
      title: 'Generate SHA-256 Hash',
      description: `Generate SHA-256 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hash-sha256',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sha512',
      title: 'Generate SHA-512 Hash',
      description: `Generate SHA-512 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hash-sha512',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sm3',
      title: 'Generate SM3 Hash',
      description: `Generate SM3 hash of "${cleanQuery || 'text'}" (Chinese National Standard)`,
      icon: '#️⃣',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'hash-sm3',
        query: cleanQuery,
      },
    });
  }

  // AES encryption tools
  if (query.startsWith('aes:') || query.startsWith('encrypt:') || query.startsWith('dev:')) {
    results.push({
      id: 'aes-encrypt',
      title: 'AES Encrypt',
      description: `Encrypt text with AES (requires password)`,
      icon: '🔒',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'aes-encrypt',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'aes-decrypt',
      title: 'AES Decrypt',
      description: `Decrypt AES encrypted text (requires password)`,
      icon: '🔓',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'aes-decrypt',
        query: cleanQuery,
      },
    });
  }

  // Bcrypt tools
  if (query.startsWith('bcrypt:') || query.startsWith('dev:')) {
    results.push({
      id: 'bcrypt-hash',
      title: 'Bcrypt Hash',
      description: `Generate bcrypt hash of "${cleanQuery || 'password'}"`,
      icon: '🔐',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'bcrypt-hash',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'bcrypt-verify',
      title: 'Bcrypt Verify',
      description: `Verify bcrypt hash against text`,
      icon: '✅',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'bcrypt-verify',
        query: cleanQuery,
      },
    });
  }

  // Timestamp converter
  if (query.startsWith('ts:') || query.startsWith('dev:')) {
    results.push({
      id: 'ts-convert',
      title: 'Convert Timestamp',
      description: 'Convert Unix timestamp to date',
      icon: '🕐',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'ts-convert',
        query: cleanQuery,
      },
    });
  }

  // UUID generator
  if (query.startsWith('uuid:') || query.startsWith('dev:')) {
    results.push({
      id: 'uuid-gen',
      title: 'Generate UUID',
      description: 'Generate a random UUID v4',
      icon: '🆔',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'uuid-gen',
      },
    });
  }

  // SQL formatter
  if (query.startsWith('sql:') || query.startsWith('dev:')) {
    results.push({
      id: 'sql-format',
      title: 'SQL Formatter',
      description: 'Format SQL statements',
      icon: '🗃️',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'sql-format',
        query: cleanQuery,
      },
    });
  }

  // YAML formatter
  if (query.startsWith('yaml:') || query.startsWith('dev:')) {
    results.push({
      id: 'yaml-format',
      title: 'YAML Formatter',
      description: 'Format YAML',
      icon: '📄',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'yaml-format',
        query: cleanQuery,
      },
    });
  }

  // XML formatter
  if (query.startsWith('xml:') || query.startsWith('dev:')) {
    results.push({
      id: 'xml-format',
      title: 'XML Formatter',
      description: 'Format XML',
      icon: '📄',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'xml-format',
        query: cleanQuery,
      },
    });
  }

  // Regex tester
  if (query.startsWith('regex:') || query.startsWith('re:') || query.startsWith('dev:')) {
    results.push({
      id: 'regex-test',
      title: 'Regex Tester',
      description: 'Test regular expressions with match highlighting',
      icon: '🔍',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'regex-test',
        query: cleanQuery,
      },
    });
  }

  // Timestamp converter
  if (query.startsWith('ts:') || query.startsWith('time:') || query.startsWith('date:') || query.startsWith('dev:')) {
    results.push({
      id: 'ts-to-date',
      title: 'Timestamp to Date',
      description: 'Convert Unix timestamp to date',
      icon: '🕐',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'ts-to-date',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'date-to-ts',
      title: 'Date to Timestamp',
      description: 'Convert date to Unix timestamp',
      icon: '🕐',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'date-to-ts',
        query: cleanQuery,
      },
    });
  }

  // QR Code generator
  if (query.startsWith('qr:') || query.startsWith('dev:')) {
    results.push({
      id: 'qrcode-gen',
      title: 'Generate QR Code',
      description: `Generate QR code for "${cleanQuery || 'text'}"`,
      icon: '📱',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'qrcode-gen',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'qrcode-parse',
      title: 'Parse QR Code',
      description: 'Parse QR code from image',
      icon: '📷',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'qrcode-parse',
      },
    });
  }

  // Barcode generator
  if (query.startsWith('barcode:') || query.startsWith('dev:')) {
    results.push({
      id: 'barcode-gen',
      title: 'Generate Barcode',
      description: `Generate barcode for "${cleanQuery || 'text'}"`,
      icon: '📊',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'barcode-gen',
        query: cleanQuery,
      },
    });
  }

  // Pinyin converter
  if (query.startsWith('pinyin:') || query.startsWith('dev:')) {
    results.push({
      id: 'pinyin-convert',
      title: 'Convert to Pinyin',
      description: `Convert Chinese to pinyin: "${cleanQuery || 'text'}"`,
      icon: '🈵',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 'pinyin-convert',
        query: cleanQuery,
      },
    });
  }

  // Simplified to Traditional
  if (query.startsWith('s2t:') || query.startsWith('dev:')) {
    results.push({
      id: 's2t-convert',
      title: 'Simplified to Traditional',
      description: `Convert simplified to traditional: "${cleanQuery || 'text'}"`,
      icon: '繁',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 's2t-convert',
        query: cleanQuery,
      },
    });
  }

  // Traditional to Simplified
  if (query.startsWith('t2s:') || query.startsWith('dev:')) {
    results.push({
      id: 't2s-convert',
      title: 'Traditional to Simplified',
      description: `Convert traditional to simplified: "${cleanQuery || 'text'}"`,
      icon: '简',
      actionData: {
        type: 'open-ui',
        pluginId: 'devtools',
        toolId: 't2s-convert',
        query: cleanQuery,
      },
    });
  }

  return results;
}

// Action executor (runs on main thread)
export async function executeAction(actionData: any): Promise<string> {
  const { type, query, algorithm } = actionData;

  switch (type) {
    case 'format-json': {
      if (!query) {
        return 'Error: No JSON provided';
      }
      const result = formatJSON(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'base64-encode': {
      if (!query) {
        return 'Error: No text provided';
      }
      return base64Encode(query);
    }

    case 'base64-decode': {
      if (!query) {
        return 'Error: No Base64 string provided';
      }
      const result = base64Decode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'url-encode': {
      if (!query) {
        return 'Error: No text provided';
      }
      return urlEncode(query);
    }

    case 'url-decode': {
      if (!query) {
        return 'Error: No encoded string provided';
      }
      const result = urlDecode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'unicode-encode': {
      if (!query) {
        return 'Error: No text provided';
      }
      const result = unicodeEncode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'unicode-decode': {
      if (!query) {
        return 'Error: No Unicode string provided';
      }
      const result = unicodeDecode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'hex-encode': {
      if (!query) {
        return 'Error: No text provided';
      }
      const result = hexEncode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'hex-decode': {
      if (!query) {
        return 'Error: No hex string provided';
      }
      const result = hexDecode(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'hash': {
      if (!query) {
        return 'Error: No text provided';
      }
      const result = await generateHash(query, algorithm || 'md5');
      if (result.success) {
        return `${(algorithm || 'md5').toUpperCase()}: ${result.result}`;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'aes-encrypt': {
      if (!query) {
        return 'Error: No text provided';
      }
      if (!actionData.password) {
        return 'Error: Password is required for AES encryption';
      }
      const encResult = await aesEncrypt(query, actionData.password);
      if (encResult.success) {
        return JSON.stringify(encResult.result);
      } else {
        return `Error: ${encResult.error}`;
      }
    }

    case 'aes-decrypt': {
      if (!query) {
        return 'Error: No encrypted text provided';
      }
      if (!actionData.password) {
        return 'Error: Password is required for AES decryption';
      }
      try {
        const parsed = JSON.parse(query);
        const decResult = await aesDecrypt(parsed.ciphertext, actionData.password, parsed.iv, parsed.salt);
        if (decResult.success) {
          return decResult.result;
        } else {
          return `Error: ${decResult.error}`;
        }
      } catch {
        return 'Error: Invalid encrypted input format';
      }
    }

    case 'bcrypt-hash': {
      if (!query) {
        return 'Error: No password provided';
      }
      const rounds = parseInt(actionData.rounds || '10', 10);
      const hashResult = await bcryptHash(query, rounds);
      if (hashResult.success) {
        return hashResult.result;
      } else {
        return `Error: ${hashResult.error}`;
      }
    }

    case 'bcrypt-verify': {
      if (!query) {
        return 'Error: No password provided';
      }
      if (!actionData.hash) {
        return 'Error: Hash is required for verification';
      }
      const verifyResult = await bcryptVerify(query, actionData.hash);
      if (verifyResult.success) {
        return verifyResult.result ? 'Verification passed: Hash matches' : 'Verification failed: Hash does not match';
      } else {
        return `Error: ${verifyResult.error}`;
      }
    }

    case 'timestamp': {
      if (!query) {
        return 'Error: No timestamp provided';
      }
      const result = convertTimestamp(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'uuid': {
      return generateUUID();
    }

    // JSON tools
    case 'json-format': {
      if (!query) {
        return 'Error: No JSON provided';
      }
      const result = jsonFormat(query, 2);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'json-validate': {
      if (!query) {
        return 'Error: No JSON provided';
      }
      const result = jsonValidate(query);
      if (result.success) {
        return 'JSON 格式正确';
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'json-to-csv': {
      if (!query) {
        return 'Error: No JSON provided';
      }
      const result = jsonToCsv(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'json-to-get': {
      if (!query) {
        return 'Error: No JSON provided';
      }
      const result = jsonToGetParams(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'json-escape': {
      if (!query) {
        return 'Error: No text provided';
      }
      const result = jsonEscape(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'json-unescape': {
      if (!query) {
        return 'Error: No text provided';
      }
      const result = jsonUnescape(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    // Code formatting tools
    case 'sql-format': {
      if (!query) {
        return 'Error: No SQL provided';
      }
      const result = sqlFormat(query, 2);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'yaml-format': {
      if (!query) {
        return 'Error: No YAML provided';
      }
      const result = yamlFormat(query, 2);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    case 'xml-format': {
      if (!query) {
        return 'Error: No XML provided';
      }
      const result = xmlFormat(query, 2);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    // Regex tester
    case 'regex-test': {
      if (!query) {
        return 'Error: No input provided for regex test';
      }
      // Expect format: pattern|flags|text or just pattern and use flags from actionData
      const parts = query.split('|');
      let pattern = parts[0];
      let flags = actionData.flags || 'g';
      let text = parts[1] || actionData.text || '';

      if (parts.length >= 3) {
        flags = parts[1];
        text = parts[2];
      }

      if (!pattern) {
        return 'Error: No regex pattern provided';
      }
      if (!text) {
        return 'Error: No text provided to match against';
      }

      const result = testRegex(pattern, text, flags);
      if (result.success) {
        return formatMatchGroups(result.result!.matches);
      } else {
        return `Error: ${result.error}`;
      }
    }

    // Timestamp to date
    case 'ts-to-date': {
      if (!query) {
        return 'Error: No timestamp provided';
      }
      const result = timestampToDate(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    // Date to timestamp
    case 'date-to-ts': {
      if (!query) {
        return 'Error: No date provided';
      }
      const result = dateToTimestamp(query);
      if (result.success) {
        return result.result!;
      } else {
        return `Error: ${result.error}`;
      }
    }

    default:
      return `Error: Unknown action type: ${type}`;
  }
}

// Default export
const plugin: PluginV2 = {
  manifest,
  onSearch,
  executeAction,
  ui: { component: DevToolsUI },
};

export default plugin;
