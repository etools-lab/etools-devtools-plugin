import type { ConversionResult } from '../../types';

/**
 * JSON formatting and validation utilities
 */

/**
 * Format JSON with custom indent
 */
export function jsonFormat(input: string, indent: number = 2): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const parsed = JSON.parse(input);
    const result = JSON.stringify(parsed, null, indent);
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
      error: error instanceof Error ? error.message : 'Invalid JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * JSON validation with detailed error location
 */
export interface JsonValidateResult extends ConversionResult<boolean> {
  metadata?: {
    duration?: number;
    inputLength?: number;
    errorLocation?: {
      line: number;
      column: number;
      position: number;
    };
  };
}

export function jsonValidate(input: string): JsonValidateResult {
  const startTime = performance.now();
  try {
    JSON.parse(input);
    return {
      success: true,
      result: true,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    // Try to extract line/column information from the error
    let line = 1, column = 1, position = 0;

    // Parse position from error message if available
    const positionMatch = errorMessage.match(/position\s+(\d+)/i);
    if (positionMatch) {
      position = parseInt(positionMatch[1], 10);
      const linesBeforePosition = input.substring(0, position).split('\n');
      line = linesBeforePosition.length;
      column = linesBeforePosition[line - 1].length + 1;
    } else {
      // Fallback: count lines and columns manually
      for (let i = 0; i < Math.min(position, input.length); i++) {
        if (input[i] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
      }
    }

    return {
      success: false,
      error: errorMessage,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        errorLocation: {
          line,
          column,
          position,
        },
      },
    };
  }
}

/**
 * Convert JSON array to CSV format
 */
export function jsonToCsv(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const parsed = JSON.parse(input);

    // Handle both array and object
    const data: any[] = Array.isArray(parsed) ? parsed : [parsed];

    if (data.length === 0) {
      return {
        success: true,
        result: '',
        metadata: {
          duration: Math.round(performance.now() - startTime),
          inputLength: input.length,
        },
      };
    }

    // Get all unique keys from all objects
    const keys = new Set<string>();
    data.forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => keys.add(key));
      }
    });

    const headers = Array.from(keys);
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.map((h) => `"${h}"`).join(','));

    // Add data rows
    data.forEach((obj) => {
      const row = headers.map((header) => {
        const value = obj?.[header];
        if (value === null || value === undefined) {
          return '';
        }
        const strValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      });
      csvRows.push(row.join(','));
    });

    const result = csvRows.join('\n');
    return {
      success: true,
      result,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        outputLength: result.length,
        extra: {
          rows: data.length,
          columns: headers.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON array',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Convert JSON object to URL GET parameters
 */
export function jsonToGetParams(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const parsed = JSON.parse(input);

    // Handle both array and object
    const data: Record<string, any> = Array.isArray(parsed)
      ? parsed.reduce((acc, item, index) => {
          if (item && typeof item === 'object') {
            Object.entries(item).forEach(([key, value]) => {
              acc[`${key}[${index}]`] = value;
            });
          }
          return acc;
        }, {} as Record<string, any>)
      : parsed;

    const params = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });

    const result = params.toString();
    return {
      success: true,
      result: result,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        outputLength: result.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Escape JSON string for use in JavaScript
 */
export function jsonEscape(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const result = JSON.stringify(input).slice(1, -1); // Remove surrounding quotes
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
      error: error instanceof Error ? error.message : 'Failed to escape JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Unescape JSON string from JavaScript format
 */
export function jsonUnescape(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    // Add surrounding quotes to make it valid JSON string
    const jsonString = `"${input}"`;
    const result = JSON.parse(jsonString);
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
      error: error instanceof Error ? error.message : 'Failed to unescape JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Minify JSON (remove whitespace)
 */
export function jsonMinify(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const parsed = JSON.parse(input);
    const result = JSON.stringify(parsed);
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
      error: error instanceof Error ? error.message : 'Invalid JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Extract keys from JSON object
 */
export function jsonExtractKeys(input: string): ConversionResult<string[]> {
  const startTime = performance.now();
  try {
    const parsed = JSON.parse(input);

    function extractKeys(obj: any, prefix: string = ''): string[] {
      const keys: string[] = [];
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          keys.push(...extractKeys(item, `${prefix}[${index}]`));
        });
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          keys.push(fullKey);
          keys.push(...extractKeys(obj[key], fullKey));
        });
      }
      return keys;
    }

    const keys = extractKeys(parsed);
    return {
      success: true,
      result: keys,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        extra: { count: keys.length },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}
