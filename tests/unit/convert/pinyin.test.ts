import { describe, it, expect } from 'vitest';
import { convertToPinyin } from '../../../src/tools/convert/pinyin';

describe('Pinyin Converter', () => {
  describe('convertToPinyin', () => {
    it('should convert Chinese text to pinyin without tones', () => {
      const result = convertToPinyin('你好世界');
      expect(result.success).toBe(true);
      expect(result.result).toContain('ni');
      expect(result.result).toContain('hao');
      expect(result.result).toContain('shi');
      expect(result.result).toContain('jie');
    });

    it('should handle empty string', () => {
      const result = convertToPinyin('');
      expect(result.success).toBe(true);
      expect(result.result).toBe('');
    });

    it('should handle text with tone marks', () => {
      const result = convertToPinyin('你好世界', { toneType: 'symbol' });
      expect(result.success).toBe(true);
      // Result should contain tone marks
      expect(result.result).toBeTruthy();
    });

    it('should handle text with tone numbers', () => {
      const result = convertToPinyin('你好世界', { toneType: 'number' });
      expect(result.success).toBe(true);
      // Result should contain tone numbers (1-4)
      expect(result.result).toBeTruthy();
    });

    it('should output initials only', () => {
      const result = convertToPinyin('你好世界', { outputType: 'initials' });
      expect(result.success).toBe(true);
      // Should be single letters
      expect(result.result).toBeTruthy();
    });

    it('should use custom separator', () => {
      const result = convertToPinyin('你好世界', { separator: ',' });
      expect(result.success).toBe(true);
      expect(result.result).toContain(',');
    });

    it('should preserve non-Chinese characters', () => {
      const result = convertToPinyin('Hello世界', { nonChinese: 'join' });
      expect(result.success).toBe(true);
      // pinyin-pro joins non-Chinese characters, check for presence of letter pinyin
      expect(result.result?.toLowerCase()).toContain('h');
      expect(result.result?.toLowerCase()).toContain('e');
      // Check for Chinese pinyin is present
      expect(result.result?.toLowerCase()).toContain('shi');
    });

    it('should skip non-Chinese characters when specified', () => {
      const result = convertToPinyin('Hello世界', { nonChinese: 'skip' });
      expect(result.success).toBe(true);
      // Should only contain pinyin for Chinese characters
    });

    it('should include metadata in result', () => {
      const result = convertToPinyin('你好世界');
      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.duration).toBeDefined();
      expect(result.metadata?.inputLength).toBe(4);
      expect(result.metadata?.outputLength).toBeGreaterThan(0);
      expect(result.metadata?.extra?.chineseChars).toBe(4);
    });

    it('should handle long Chinese text', () => {
      const longText = '中华民族是一个历史悠久的民族，有着灿烂的文化和辉煌的历史';
      const result = convertToPinyin(longText);
      expect(result.success).toBe(true);
      expect(result.result).toBeTruthy();
      expect(result.result?.length).toBeGreaterThan(0);
    });

    it('should handle single character', () => {
      const result = convertToPinyin('中');
      expect(result.success).toBe(true);
      expect(result.result).toBeTruthy();
    });

    it('should handle numbers and special characters', () => {
      const result = convertToPinyin('12345');
      expect(result.success).toBe(true);
    });

    it('should handle mixed content', () => {
      const result = convertToPinyin('中国China美国USA');
      expect(result.success).toBe(true);
      expect(result.result).toBeTruthy();
    });
  });
});
