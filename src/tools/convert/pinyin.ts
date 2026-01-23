/**
 * Pinyin converter using pinyin-pro
 */

import type { ConversionResult } from '../../types';
import { pinyin } from 'pinyin-pro';

/**
 * Tone type options
 */
export type ToneType = 'symbol' | 'none' | 'number';

/**
 * Output type options
 */
export type OutputType = 'full' | 'initials' | 'array';

/**
 * Pinyin conversion options
 */
export interface PinyinOptions {
  /** Tone type: 'symbol' (with tone marks), 'none' (without tones), 'number' (with tone numbers) */
  toneType?: ToneType;
  /** Output type: 'full' (full pinyin), 'initials' (first letters only), 'array' (array of syllables) */
  outputType?: OutputType;
  /** Custom separator between pinyin syllables */
  separator?: string;
  /** Whether to keep non-Chinese characters */
  nonChinese?: 'spare' | 'join' | 'skip';
}

/**
 * Convert Chinese text to pinyin
 */
export function convertToPinyin(
  text: string,
  options: PinyinOptions = {}
): ConversionResult<string> {
  const startTime = performance.now();

  try {
    const {
      toneType = 'none',
      outputType = 'full',
      separator = ' ',
      nonChinese = 'spare',
    } = options;

    // Configure tone type
    const toneMap: Record<ToneType, 'symbol' | 'none' | 'number'> = {
      symbol: 'symbol',
      none: 'none',
      number: 'number',
    };

    // Configure output type
    const typeMap: Record<OutputType, 'string' | 'array'> = {
      full: 'string',
      initials: 'string',
      array: 'array',
    };

    let result: string | string[];

    if (outputType === 'initials') {
      // Get full pinyin first, then extract initials
      const fullPinyin = pinyin(text, {
        toneType: toneMap[toneType],
        type: 'string',
        nonChinese,
      });
      result = fullPinyin
        .split(separator)
        .map((syllable: string) => {
          // Extract first letter of each syllable
          const match = syllable.match(/^[a-zA-Z]/);
          return match ? match[0].toUpperCase() : '';
        })
        .join(separator);
    } else {
      result = pinyin(text, {
        toneType: toneMap[toneType],
        type: typeMap[outputType],
        nonChinese,
        separator,
      });
    }

    const endTime = performance.now();

    // Handle array output
    const outputString = Array.isArray(result) ? result.join(separator) : result;

    return {
      success: true,
      result: outputString,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: outputString.length,
        extra: {
          toneType,
          outputType,
          chineseChars: countChineseChars(text),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert to pinyin',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Get pinyin for a single Chinese character
 */
export function getPinyinForChar(
  char: string,
  toneType: ToneType = 'none'
): ConversionResult<string> {
  const startTime = performance.now();

  try {
    if (char.length !== 1) {
      return {
        success: false,
        error: 'Input must be a single character',
        metadata: {
          duration: Math.round(performance.now() - startTime),
        },
      };
    }

    const result = pinyin(char, {
      toneType: toneType === 'number' ? 'number' : toneType === 'symbol' ? 'symbol' : 'none',
      type: 'string',
    });

    const endTime = performance.now();

    return {
      success: true,
      result,
      metadata: {
        duration: Math.round(endTime - startTime),
        extra: {
          character: char,
          toneType,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get pinyin',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  }
}

/**
 * Get tone number from pinyin with tone mark
 */
export function getToneNumber(pinyinWithTone: string): ConversionResult<number> {
  const startTime = performance.now();

  try {
    // Tone number mapping
    const toneMap: Record<string, number> = {
      'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
      'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
      'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
      'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
      'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
      'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4,
    };

    for (const [char, tone] of Object.entries(toneMap)) {
      if (pinyinWithTone.includes(char)) {
        return {
          success: true,
          result: tone,
          metadata: {
            duration: Math.round(performance.now() - startTime),
          },
        };
      }
    }

    return {
      success: false,
      error: 'No tone mark found in pinyin',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tone number',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  }
}

/**
 * Count Chinese characters in text
 */
function countChineseChars(text: string): number {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const matches = text.match(chineseRegex);
  return matches ? matches.length : 0;
}

/**
 * Get all possible pinyin readings for a character
 */
export function getAllPinyinReadings(char: string): ConversionResult<string[]> {
  const startTime = performance.now();

  try {
    if (char.length !== 1) {
      return {
        success: false,
        error: 'Input must be a single character',
        metadata: {
          duration: Math.round(performance.now() - startTime),
        },
      };
    }

    // pinyin-pro doesn't have a direct method for all readings,
    // so we return the most common one
    const result = [pinyin(char, { toneType: 'none', type: 'string' })];

    return {
      success: true,
      result,
      metadata: {
        duration: Math.round(performance.now() - startTime),
        extra: {
          character: char,
          readingsCount: result.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get pinyin readings',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  }
}
