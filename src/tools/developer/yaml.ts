import type { ConversionResult } from '../../types';

/**
 * YAML formatting utilities
 */

/**
 * Format YAML with proper indentation
 */
export function yamlFormat(input: string, indentSize: number = 2): ConversionResult<string> {
  const startTime = performance.now();
  try {
    // Parse YAML to JavaScript object
    const parsed = yamlParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error);
    }

    // Convert back to YAML with proper formatting
    const result = yamlStringify(parsed.result, indentSize);

    return {
      success: true,
      result,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format YAML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Simple YAML parser
 */
function yamlParse(input: string): ConversionResult<any> {
  const lines = input.split('\n');
  const result: any = {};
  const stack: any[] = [result];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Calculate indentation
    const indent = line.search(/\S/);

    // Handle list items
    if (trimmed.startsWith('- ')) {
      const value = trimmed.substring(2).trim();
      const currentParent = stack[stack.length - 1];

      if (!Array.isArray(currentParent)) {
        // Find the parent object
        let parentObj: any = result;
        for (let j = 1; j < stack.length; j++) {
          parentObj = parentObj[Object.keys(parentObj)[Object.keys(parentObj).length - 1]];
        }
        // Get the last key
        const keys = Object.keys(parentObj);
        if (keys.length > 0) {
          const lastKey = keys[keys.length - 1];
          if (!Array.isArray(parentObj[lastKey])) {
            parentObj[lastKey] = [];
          }
          if (value.includes(':')) {
            const obj = parseKeyValue(value);
            parentObj[lastKey].push(obj);
            stack.push(obj);
            indentStack.push(indent);
          } else {
            parentObj[lastKey].push(parseValue(value));
          }
        }
      } else {
        if (value.includes(':')) {
          const obj = parseKeyValue(value);
          currentParent.push(obj);
          stack.push(obj);
          indentStack.push(indent);
        } else {
          currentParent.push(parseValue(value));
        }
      }
      continue;
    }

    // Pop stack based on indentation
    while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
      stack.pop();
      indentStack.pop();
    }

    // Handle key-value pairs
    if (trimmed.includes(':')) {
      const { key, value } = parseKeyValue(trimmed);
      const currentParent = stack[stack.length - 1];

      if (value === null || value === '') {
        // Nested object
        currentParent[key] = {};
        stack.push(currentParent[key]);
        indentStack.push(indent);
      } else {
        currentParent[key] = parseValue(value);
      }
    }
  }

  return { success: true, result };
}

interface KeyValue {
  key: string;
  value: string;
}

function parseKeyValue(line: string): KeyValue {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) {
    return { key: line.trim(), value: '' };
  }
  const key = line.substring(0, colonIndex).trim();
  const value = line.substring(colonIndex + 1).trim();
  return { key, value };
}

function parseValue(value: string): any {
  if (!value) return undefined;

  // Handle quoted strings
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Handle booleans
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  // Handle null
  if (value.toLowerCase() === 'null' || value.toLowerCase() === '~') return null;

  // Handle numbers
  if (!isNaN(Number(value)) && value !== '') return Number(value);

  return value;
}

/**
 * Convert JavaScript object to YAML string
 */
function yamlStringify(obj: any, indentSize: number = 2, currentIndent: number = 0): string {
  const indent = ' '.repeat(currentIndent);
  const nextIndent = ' '.repeat(currentIndent + indentSize);
  const lines: string[] = [];

  if (obj === null || obj === undefined) {
    return '~';
  }

  if (typeof obj !== 'object') {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        lines.push(`${indent}-`);
        lines.push(yamlStringify(item, indentSize, currentIndent + indentSize));
      } else {
        lines.push(`${indent}- ${yamlStringify(item, indentSize, 0)}`);
      }
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
        lines.push(`${indent}${key}:`);
        lines.push(yamlStringify(value, indentSize, currentIndent + indentSize));
      } else if (Array.isArray(value)) {
        lines.push(`${indent}${key}:`);
        for (const item of value) {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${nextIndent}-`);
            lines.push(yamlStringify(item, indentSize, currentIndent + indentSize * 2));
          } else {
            lines.push(`${nextIndent}- ${yamlStringify(item, indentSize, 0)}`);
          }
        }
      } else if (value === null || value === undefined) {
        lines.push(`${indent}${key}: ~`);
      } else if (typeof value === 'string' && (value.includes('\n') || value.includes(':') || value.includes('#'))) {
        lines.push(`${indent}${key}: |`);
        lines.push(nextIndent + value.replace(/\n/g, `\n${nextIndent}`));
      } else {
        lines.push(`${indent}${key}: ${yamlStringify(value, indentSize, 0)}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Minify YAML (remove all unnecessary whitespace)
 */
export function yamlMinify(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input.trim();

    // Remove comments
    result = result.replace(/#.*$/gm, '');

    // Remove empty lines
    result = result.replace(/^\s*$/gm, '');

    // Normalize whitespace in key-value pairs
    result = result.replace(/:\s*/g, ': ');

    return {
      success: true,
      result,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to minify YAML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}
