import type { ConversionResult } from '../../types';

/**
 * Timezone offset info
 */
export interface TimezoneOffset {
  name: string;
  offset: number;
  label: string;
}

/**
 * Common timezone options
 */
export const TIMEZONES: TimezoneOffset[] = [
  { name: 'UTC', offset: 0, label: 'UTC+0' },
  { name: 'America/New_York', offset: -5, label: 'UTC-5 (纽约)' },
  { name: 'America/Los_Angeles', offset: -8, label: 'UTC-8 (洛杉矶)' },
  { name: 'Europe/London', offset: 0, label: 'UTC+0 (伦敦)' },
  { name: 'Europe/Paris', offset: 1, label: 'UTC+1 (巴黎)' },
  { name: 'Asia/Tokyo', offset: 9, label: 'UTC+9 (东京)' },
  { name: 'Asia/Shanghai', offset: 8, label: 'UTC+8 (北京时间)' },
  { name: 'Asia/Hong_Kong', offset: 8, label: 'UTC+8 (香港)' },
  { name: 'Australia/Sydney', offset: 11, label: 'UTC+11 (悉尼)' },
];

/**
 * Detect if timestamp is in seconds or milliseconds
 */
export function detectTimestampUnit(timestamp: number): 'seconds' | 'milliseconds' {
  // Timestamps in seconds are typically < 10^10 (before year 2286)
  // Timestamps in milliseconds are typically >= 10^12
  const timestampStr = timestamp.toString();

  if (timestampStr.length <= 10) {
    return 'seconds';
  }
  return 'milliseconds';
}

/**
 * Convert timestamp to Date object
 */
export function timestampToDate(timestamp: string, timezoneOffset?: number): ConversionResult {
  try {
    const ts = parseInt(timestamp.trim(), 10);

    if (isNaN(ts)) {
      return {
        success: false,
        error: '无效的时间戳',
      };
    }

    const unit = detectTimestampUnit(ts);
    const milliseconds = unit === 'seconds' ? ts * 1000 : ts;

    const date = timezoneOffset !== undefined
      ? new Date(milliseconds + timezoneOffset * 60 * 60 * 1000)
      : new Date(milliseconds);

    return {
      success: true,
      result: formatDateOutput(date, unit, timezoneOffset),
      metadata: {
        timestamp: milliseconds,
        unit,
        iso: date.toISOString(),
        unix: Math.floor(milliseconds / 1000),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的时间戳',
    };
  }
}

/**
 * Convert Date to timestamp
 */
export function dateToTimestamp(dateString: string, timezoneOffset?: number): ConversionResult {
  try {
    // Try parsing as ISO date first
    let date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: '无效的日期格式',
      };
    }

    const adjustedDate = timezoneOffset !== undefined
      ? new Date(date.getTime() - timezoneOffset * 60 * 60 * 1000)
      : date;

    const unixSeconds = Math.floor(adjustedDate.getTime() / 1000);
    const milliseconds = adjustedDate.getTime();

    return {
      success: true,
      result: formatTimestampOutput(milliseconds, 'milliseconds') +
        '\n\n' +
        formatTimestampOutput(unixSeconds, 'seconds'),
      metadata: {
        unixSeconds,
        milliseconds,
        iso: adjustedDate.toISOString(),
        localString: adjustedDate.toLocaleString('zh-CN'),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的日期',
    };
  }
}

/**
 * Get current timestamp in both formats
 */
export function getCurrentTimestamp(): ConversionResult {
  const now = Date.now();
  const unixSeconds = Math.floor(now / 1000);

  return {
    success: true,
    result: formatTimestampOutput(now, 'milliseconds') +
      '\n\n' +
      formatTimestampOutput(unixSeconds, 'seconds'),
    metadata: {
      unixSeconds,
      milliseconds: now,
      iso: new Date(now).toISOString(),
      localString: new Date(now).toLocaleString('zh-CN'),
    },
  };
}

/**
 * Format date output
 */
function formatDateOutput(date: Date, unit: 'seconds' | 'milliseconds', timezoneOffset?: number): string {
  const lines: string[] = [];

  lines.push('时间戳转换结果:');
  lines.push('');
  lines.push(`原始输入 (${unit === 'seconds' ? '秒' : '毫秒'}): ${date.getTime() / (unit === 'seconds' ? 1000 : 1)}`);
  lines.push('');
  lines.push('日期时间:');
  lines.push(`  ISO 8601: ${date.toISOString()}`);
  lines.push(`  本地时间: ${date.toLocaleString('zh-CN')}`);
  lines.push(`  UTC 时间: ${date.toUTCString()}`);
  lines.push(`  年: ${date.getFullYear()}`);
  lines.push(`  月: ${date.getMonth() + 1}`);
  lines.push(`  日: ${date.getDate()}`);
  lines.push(`  时: ${date.getHours()}`);
  lines.push(`  分: ${date.getMinutes()}`);
  lines.push(`  秒: ${date.getSeconds()}`);
  lines.push(`  星期: ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}`);

  if (timezoneOffset !== undefined) {
    lines.push('');
    lines.push(`时区偏移: UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`);
  }

  return lines.join('\n');
}

/**
 * Format timestamp output
 */
function formatTimestampOutput(ms: number, unit: 'seconds' | 'milliseconds'): string {
  const value = unit === 'seconds' ? Math.floor(ms / 1000) : ms;

  return `${unit === 'seconds' ? '秒级时间戳' : '毫秒级时间戳'}: ${value}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(timestamp: string): ConversionResult {
  try {
    const ts = parseInt(timestamp.trim(), 10);

    if (isNaN(ts)) {
      return {
        success: false,
        error: '无效的时间戳',
      };
    }

    const unit = detectTimestampUnit(ts);
    const milliseconds = unit === 'seconds' ? ts * 1000 : ts;

    const then = new Date(milliseconds);
    const now = Date.now();
    const diff = now - milliseconds;

    const absDiff = Math.abs(diff);
    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let relative: string;
    if (years > 0) {
      relative = `${years} 年${years === 1 ? '' : ''}`;
    } else if (months > 0) {
      relative = `${months} 月`;
    } else if (weeks > 0) {
      relative = `${weeks} 周`;
    } else if (days > 0) {
      relative = `${days} 天`;
    } else if (hours > 0) {
      relative = `${hours} 小时`;
    } else if (minutes > 0) {
      relative = `${minutes} 分钟`;
    } else {
      relative = `${seconds} 秒`;
    }

    const result = diff >= 0 ? `${relative} 前` : `${relative} 后`;

    return {
      success: true,
      result: result,
      metadata: {
        timestamp: milliseconds,
        relative,
        direction: diff >= 0 ? 'past' : 'future',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '无效的时间戳',
    };
  }
}

/**
 * Parse natural language date/time
 */
export function parseNaturalLanguage(text: string): ConversionResult {
  const now = new Date();
  let targetTime: Date | null = null;
  let parsed = text.trim().toLowerCase();

  try {
    // Handle "now"
    if (parsed === 'now') {
      targetTime = now;
    }
    // Handle relative times
    else if (parsed.includes(' ago')) {
      const num = parseInt(parsed.replace(/\D/g, ''), 10);
      if (!isNaN(num)) {
        targetTime = new Date(now.getTime());
        if (parsed.includes('second')) {
          targetTime.setSeconds(targetTime.getSeconds() - num);
        } else if (parsed.includes('minute')) {
          targetTime.setMinutes(targetTime.getMinutes() - num);
        } else if (parsed.includes('hour')) {
          targetTime.setHours(targetTime.getHours() - num);
        } else if (parsed.includes('day')) {
          targetTime.setDate(targetTime.getDate() - num);
        } else if (parsed.includes('week')) {
          targetTime.setDate(targetTime.getDate() - num * 7);
        } else if (parsed.includes('month')) {
          targetTime.setMonth(targetTime.getMonth() - num);
        } else if (parsed.includes('year')) {
          targetTime.setFullYear(targetTime.getFullYear() - num);
        }
      }
    }
    // Handle "in X time"
    else if (parsed.includes(' in ')) {
      const num = parseInt(parsed.replace(/\D/g, ''), 10);
      if (!isNaN(num)) {
        targetTime = new Date(now.getTime());
        if (parsed.includes('second')) {
          targetTime.setSeconds(targetTime.getSeconds() + num);
        } else if (parsed.includes('minute')) {
          targetTime.setMinutes(targetTime.getMinutes() + num);
        } else if (parsed.includes('hour')) {
          targetTime.setHours(targetTime.getHours() + num);
        } else if (parsed.includes('day')) {
          targetTime.setDate(targetTime.getDate() + num);
        } else if (parsed.includes('week')) {
          targetTime.setDate(targetTime.getDate() + num * 7);
        } else if (parsed.includes('month')) {
          targetTime.setMonth(targetTime.getMonth() + num);
        } else if (parsed.includes('year')) {
          targetTime.setFullYear(targetTime.getFullYear() + num);
        }
      }
    }
    // Try parsing as standard date format
    else {
      const standardDate = new Date(parsed);
      if (!isNaN(standardDate.getTime())) {
        targetTime = standardDate;
      }
    }

    if (!targetTime) {
      return {
        success: false,
        error: '无法解析日期表达式',
      };
    }

    const unixSeconds = Math.floor(targetTime.getTime() / 1000);
    const milliseconds = targetTime.getTime();

    return {
      success: true,
      result: formatTimestampOutput(milliseconds, 'milliseconds') +
        '\n\n' +
        formatTimestampOutput(unixSeconds, 'seconds') +
        '\n\n' +
        `日期: ${targetTime.toLocaleString('zh-CN')}`,
      metadata: {
        unixSeconds,
        milliseconds,
        iso: targetTime.toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '解析失败',
    };
  }
}
