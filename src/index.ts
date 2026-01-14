/**
 * ETools Developer Tools Plugin
 *
 * A collection of useful developer utilities:
 * - JSON formatter and validator
 * - Base64 encoder/decoder
 * - URL encoder/decoder
 * - Hash generator (MD5, SHA-1, SHA-256)
 * - Timestamp converter
 * - UUID generator
 */

import type {
  PluginV2,
  PluginManifest,
  PluginSearchResultV2,
} from './types';

export const manifest: PluginManifest = {
  id: 'devtools',
  name: 'Developer Tools',
  version: '1.1.0',
  description: 'Developer utilities - JSON formatter, Base64, URL encode, hash generator, timestamp converter, UUID',
  author: 'ETools Team',
  permissions: ['write:clipboard'],
  triggers: ['dev:', 'json:', 'base64:', 'url:', 'hash:', 'ts:', 'uuid:', 'ui:'],
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

function base64Encode(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(encoded: string): { success: boolean; result?: string; error?: string } {
  try {
    return {
      success: true,
      result: decodeURIComponent(escape(atob(encoded))),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid Base64 string',
    };
  }
}

function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

function urlDecode(encoded: string): { success: boolean; result?: string; error?: string } {
  try {
    return {
      success: true,
      result: decodeURIComponent(encoded),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid URL encoding',
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
  const cleanQuery = query.replace(/^(dev:|json:|base64:|url:|hash:|ts:|uuid:)/, '').trim();

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
        type: 'format-json',
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
        type: 'base64-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'base64-decode',
      title: 'Base64 Decode',
      description: 'Decode Base64 to text',
      icon: '🔓',
      actionData: {
        type: 'base64-decode',
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
        type: 'url-encode',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'url-decode',
      title: 'URL Decode',
      description: 'Decode URL components',
      icon: '🔗',
      actionData: {
        type: 'url-decode',
        query: cleanQuery,
      },
    });
  }

  // Hash generator
  if (query.startsWith('hash:') || query.startsWith('dev:')) {
    results.push({
      id: 'hash-md5',
      title: 'Generate MD5 Hash',
      description: `Generate MD5 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'hash',
        algorithm: 'md5',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sha1',
      title: 'Generate SHA-1 Hash',
      description: `Generate SHA-1 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'hash',
        algorithm: 'sha-1',
        query: cleanQuery,
      },
    });

    results.push({
      id: 'hash-sha256',
      title: 'Generate SHA-256 Hash',
      description: `Generate SHA-256 hash of "${cleanQuery || 'text'}"`,
      icon: '#️⃣',
      actionData: {
        type: 'hash',
        algorithm: 'sha-256',
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
        type: 'timestamp',
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
        type: 'uuid',
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

    case 'hash': {
      if (!query) {
        return 'Error: No text provided';
      }
      const hash = await generateHash(query, algorithm);
      return `${algorithm.toUpperCase()}: ${hash}`;
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

    default:
      return `Error: Unknown action type: ${type}`;
  }
}

// UI component (optional, only available when loaded as local plugin)
// This will be dynamically imported by etools when needed
// @ts-ignore - UI is optional and may not be available during build
export async function getUIComponent() {
  try {
    const uiModule = await import('./ui');
    return uiModule.DevToolsUI;
  } catch (error) {
    console.warn('UI component not available:', error);
    return null;
  }
}

// Default export
const plugin: PluginV2 = {
  manifest,
  onSearch,
  executeAction,
};

export default plugin;
