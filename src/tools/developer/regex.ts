import type { ConversionResult } from '../../types';

/**
 * Regex flag type
 */
export type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

/**
 * Regex match result with groups
 */
export interface RegexMatchResult {
  match: string;
  index: number;
  groups: (string | undefined)[];
  input: string;
}

/**
 * Regex test result
 */
export interface RegexTestResult extends ConversionResult {
  success: boolean;
  result?: {
    matches: RegexMatchResult[];
    matchCount: number;
    replacedText?: string;
  };
  error?: string;
}

/**
 * Parse regex flags from string
 */
export function parseRegexFlags(flags: string): RegexFlag[] {
  const validFlags: RegexFlag[] = ['g', 'i', 'm', 's', 'u', 'y'];
  const result: RegexFlag[] = [];

  for (const char of flags) {
    if (validFlags.includes(char as RegexFlag) && !result.includes(char as RegexFlag)) {
      result.push(char as RegexFlag);
    }
  }

  return result;
}

/**
 * Test regex pattern against input text
 */
export function testRegex(
  pattern: string,
  input: string,
  flags: string = 'g'
): RegexTestResult {
  try {
    if (!pattern) {
      return {
        success: false,
        error: '正则表达式不能为空',
      };
    }

    const regex = new RegExp(pattern, flags);
    const matches: RegexMatchResult[] = [];
    let match: RegExpExecArray | null;

    // Use global flag for multiple matches
    const globalRegex = new RegExp(regex.source, flags.includes('g') ? flags : flags + 'g');

    while ((match = globalRegex.exec(input)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: Array.from(match).slice(1).map((g) => (g === undefined ? undefined : g)),
        input: input,
      });

      // Prevent infinite loop with zero-length matches
      if (match.index === globalRegex.lastIndex) {
        globalRegex.lastIndex++;
      }
    }

    return {
      success: true,
      result: {
        matches,
        matchCount: matches.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的正则表达式',
    };
  }
}

/**
 * Replace text with regex pattern and show preview
 */
export function replaceRegex(
  pattern: string,
  input: string,
  replacement: string,
  flags: string = 'g'
): RegexTestResult {
  try {
    if (!pattern) {
      return {
        success: false,
        error: '正则表达式不能为空',
      };
    }

    const regex = new RegExp(pattern, flags);
    const replacedText = input.replace(regex, replacement);

    // Get matches for display
    const matches: RegexMatchResult[] = [];
    const globalRegex = new RegExp(regex.source, flags.includes('g') ? flags : flags + 'g');
    let match: RegExpExecArray | null;

    while ((match = globalRegex.exec(input)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: Array.from(match).slice(1).map((g) => (g === undefined ? undefined : g)),
        input: input,
      });

      if (match.index === globalRegex.lastIndex) {
        globalRegex.lastIndex++;
      }
    }

    return {
      success: true,
      result: {
        matches,
        matchCount: matches.length,
        replacedText,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的正则表达式',
    };
  }
}

/**
 * Highlight matches in text with HTML
 */
export function highlightMatches(input: string, matches: RegexMatchResult[]): string {
  if (matches.length === 0) {
    return escapeHtml(input);
  }

  // Sort matches by index in reverse order to replace from end
  const sortedMatches = [...matches].sort((a, b) => b.index - a.index);

  let result = input;
  for (const match of sortedMatches) {
    const before = result.slice(0, match.index);
    const matched = result.slice(match.index, match.index + match.match.length);
    const after = result.slice(match.index + match.match.length);

    result = before + `<mark class="regex-match">${escapeHtml(matched)}</mark>` + after;
  }

  return result;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (c) => map[c]);
}

/**
 * Format match groups for display
 */
export function formatMatchGroups(matches: RegexMatchResult[]): string {
  if (matches.length === 0) {
    return '无匹配';
  }

  let output = `找到 ${matches.length} 个匹配：\n\n`;

  matches.forEach((match, i) => {
    output += `匹配 ${i + 1} (位置: ${match.index}):\n`;
    output += `  匹配文本: "${escapeHtml(match.match)}"\n`;

    if (match.groups.length > 0 && match.groups.some((g) => g !== undefined)) {
      match.groups.forEach((group, j) => {
        if (group !== undefined) {
          output += `  组 ${j + 1}: "${escapeHtml(group)}"\n`;
        }
      });
    }

    if (i < matches.length - 1) {
      output += '\n';
    }
  });

  return output;
}

/**
 * Generate regex pattern explanation
 */
export function explainRegex(pattern: string): string {
  try {
    const regex = new RegExp(pattern);
    let explanation = `正则表达式: ${pattern}\n\n`;

    explanation += `标志位: ${regex.flags || '(无)'}\n\n`;

    explanation += '支持的标志位:\n';
    explanation += '  g - 全局匹配\n';
    explanation += '  i - 忽略大小写\n';
    explanation += '  m - 多行模式\n';
    explanation += '  s - 点号匹配换行\n';
    explanation += '  u - Unicode 模式\n';
    explanation += '  y - 粘性匹配\n\n';

    // Check for common patterns
    if (/\\[dsw]\?|\[\^dsw\]/.test(pattern)) {
      explanation += '字符类说明:\n';
      explanation += '  \\d - 数字\n';
      explanation += '  \\s - 空白字符\n';
      explanation += '  \\w - 字母数字下划线\n';
    }

    return explanation;
  } catch {
    return '无法解析正则表达式';
  }
}
