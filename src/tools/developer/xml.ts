import type { ConversionResult } from '../../types';

/**
 * XML formatting utilities
 */

/**
 * Format XML with proper indentation
 */
export function xmlFormat(input: string, indentSize: number = 2): ConversionResult<string> {
  const startTime = performance.now();
  try {
    // Parse and format XML
    const formatted = formatXml(input, indentSize);

    return {
      success: true,
      result: formatted,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
        outputLength: formatted.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to format XML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Format XML string with proper indentation
 */
function formatXml(xml: string, indentSize: number = 2): string {
  const indent = ' '.repeat(indentSize);
  let formatted = '';
  let pad = '';

  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      // Closing tag - decrease indent
      pad = pad.substring(indentSize);
    }

    formatted += pad + '<' + node + '>\n';

    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) {
      // Opening tag - increase indent
      pad += indent;
    }
  });

  // Remove first and last newlines
  return formatted.substring(1, formatted.length - 2);
}

/**
 * Minify XML (remove all unnecessary whitespace)
 */
export function xmlMinify(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input.trim();

    // Remove XML declaration if present
    result = result.replace(/<\?xml[^?]*\?>/gi, '');

    // Remove comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');

    // Remove processing instructions
    result = result.replace(/<\?[\s\S]*?\?>/g, '');

    // Remove DOCTYPE
    result = result.replace(/<!DOCTYPE[^>]*>/g, '');

    // Remove whitespace between tags
    result = result.replace(/>\s+</g, '><');

    // Remove leading/trailing whitespace
    result = result.trim();

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
      error: error instanceof Error ? error.message : 'Failed to minify XML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Escape XML special characters
 */
export function xmlEscape(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

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
      error: error instanceof Error ? error.message : 'Failed to escape XML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Unescape XML special characters
 */
export function xmlUnescape(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&');

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
      error: error instanceof Error ? error.message : 'Failed to unescape XML',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Validate XML and return errors
 */
export function xmlValidate(input: string): ConversionResult<boolean> {
  const startTime = performance.now();
  try {
    // Basic XML validation
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    const parseError = doc.querySelector('parsererror');

    if (parseError) {
      return {
        success: false,
        error: parseError.textContent || 'XML parsing error',
        metadata: {
          duration: Math.round(performance.now() - startTime),
          inputLength: input.length,
        },
      };
    }

    return {
      success: true,
      result: true,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'XML validation failed',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Convert XML to JSON
 */
export function xmlToJson(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    const parseError = doc.querySelector('parsererror');

    if (parseError) {
      return {
        success: false,
        error: parseError.textContent || 'Invalid XML',
        metadata: {
          duration: Math.round(performance.now() - startTime),
          inputLength: input.length,
        },
      };
    }

    const json = xmlToJsonObject(doc.documentElement);
    const result = JSON.stringify(json, null, 2);

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
      error: error instanceof Error ? error.message : 'Failed to convert XML to JSON',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

function xmlToJsonObject(node: Node): any {
  const obj: any = {};

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (text) {
      // Try to parse as number
      if (!isNaN(Number(text))) {
        return Number(text);
      }
      return text;
    }
    return undefined;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;

    // Attributes
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (const attr of Array.from(element.attributes)) {
        obj['@attributes'][attr.name] = attr.value;
      }
    }

    // Child nodes
    const children = Array.from(node.childNodes);
    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      return obj['#text'] || element.textContent?.trim();
    }

    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childName = child.nodeName;
        const childValue = xmlToJsonObject(child);

        if (obj[childName]) {
          // Multiple children with same name -> array
          if (!Array.isArray(obj[childName])) {
            obj[childName] = [obj[childName]];
          }
          obj[childName].push(childValue);
        } else {
          obj[childName] = childValue;
        }
      }
    }
  }

  // Remove empty objects
  if (Object.keys(obj).length === 0) {
    return undefined;
  }

  return obj;
}
