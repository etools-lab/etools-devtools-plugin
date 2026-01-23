import type { ConversionResult } from '../../types';

/**
 * SQL formatting utilities
 */

// SQL keywords for formatting
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN',
  'LIKE', 'IS', 'NULL', 'AS', 'DISTINCT', 'ORDER', 'BY', 'ASC', 'DESC',
  'LIMIT', 'OFFSET', 'GROUP', 'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT',
  'OUTER', 'ON', 'UNION', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'INDEX', 'DROP', 'ALTER', 'ADD', 'COLUMN',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
  'UNIQUE', 'CHECK', 'CASCADE', 'TRIGGER', 'VIEW', 'TEMPORARY',
  'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST', 'COALESCE',
  'NULLIF', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'FLOOR', 'CEIL',
  'CONCAT', 'SUBSTRING', 'LENGTH', 'UPPER', 'LOWER', 'TRIM', 'REPLACE',
  'DATE', 'TIME', 'TIMESTAMP', 'EXTRACT', 'INTERVAL', 'OVER', 'PARTITION',
  'WITH', 'RECURSIVE', 'CTE', 'GRANT', 'REVOKE', 'BEGIN', 'COMMIT',
  'ROLLBACK', 'TRANSACTION', 'COMMITT', 'SAVEPOINT', 'LOCK', 'UNLOCK'
];

/**
 * Format SQL query with proper indentation
 */
export function sqlFormat(input: string, indentSize: number = 2): ConversionResult<string> {
  const startTime = performance.now();
  try {
    // Basic SQL formatting
    let result = input.trim();

    // Normalize whitespace
    result = result.replace(/\s+/g, ' ');

    // Add newline before keywords (except at the start)
    const keywordsPattern = new RegExp(`\\s+(${SQL_KEYWORDS.join('|')})\\s+`, 'gi');
    result = result.replace(keywordsPattern, '\n$1 ');

    // Add newline after opening parentheses
    result = result.replace(/\(\s*/g, '(\n' + ' '.repeat(indentSize));

    // Add newline before closing parentheses
    result = result.replace(/\s*\)/g, '\n)');

    // Add newline after commas in SELECT
    result = result.replace(/,\s*/g, ',\n' + ' '.repeat(indentSize * 2));

    // Clean up multiple newlines
    result = result.replace(/\n{3,}/g, '\n\n');

    // Add proper indentation
    const lines = result.split('\n');
    let indentLevel = 0;
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing parentheses/brackets
      if (trimmed.startsWith(')') || trimmed.startsWith(']')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indented = ' '.repeat(indentLevel * indentSize) + trimmed;

      // Increase indent after opening parentheses/brackets
      if (trimmed.endsWith('(') || trimmed.endsWith('[')) {
        indentLevel++;
      }

      return indented;
    });

    result = formattedLines.filter((l) => l.trim()).join('\n');

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
      error: error instanceof Error ? error.message : 'Failed to format SQL',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Minify SQL (remove all unnecessary whitespace)
 */
export function sqlMinify(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input.trim();
    // Remove all comments
    result = result.replace(/--.*$/gm, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    // Normalize whitespace
    result = result.replace(/\s+/g, ' ');
    // Remove space around operators
    result = result.replace(/\s*([=+\-<>!;,()])\s*/g, '$1');
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
      error: error instanceof Error ? error.message : 'Failed to minify SQL',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}

/**
 * Highlight SQL syntax (returns HTML with syntax highlighting)
 */
export function sqlHighlight(input: string): ConversionResult<string> {
  const startTime = performance.now();
  try {
    let result = input;

    // Escape HTML
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight keywords
    const keywordPattern = new RegExp(`\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi');
    result = result.replace(keywordPattern, '<span class="sql-keyword">$1</span>');

    // Highlight strings
    result = result.replace(/'([^']*)'/g, "<span class='sql-string'>'$1'</span>");

    // Highlight numbers
    result = result.replace(/\b(\d+)\b/g, "<span class='sql-number'>$1</span>");

    // Highlight comments
    result = result.replace(/--.*$/gm, "<span class='sql-comment'>$&</span>");
    result = result.replace(/\/\*[\s\S]*?\*\//g, "<span class='sql-comment'>$&</span>");

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
      error: error instanceof Error ? error.message : 'Failed to highlight SQL',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: input.length,
      },
    };
  }
}
