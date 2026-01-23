import { describe, it, expect } from 'vitest';
import { s2t, t2s } from '../../../src/tools/convert/s2t';

describe('S2T/T2S Converter', () => {
  describe('s2t (Simplified to Traditional)', () => {
    it('should convert 发 to 發', () => {
      const result = s2t('发展');
      expect(result.success).toBe(true);
      expect(result.result).toBe('發展');
    });

    it('should convert 头发 to 頭髮', () => {
      const result = s2t('头发');
      expect(result.success).toBe(true);
      expect(result.result).toBe('頭髮');
    });

    it('should convert 钟 to 鐘 (when used as clock)', () => {
      const result = s2t('时钟');
      expect(result.success).toBe(true);
      expect(result.result).toBe('時鐘');
    });

    it('should handle empty string', () => {
      const result = s2t('');
      expect(result.success).toBe(true);
      expect(result.result).toBe('');
    });

    it('should preserve non-Chinese characters', () => {
      const result = s2t('Hello世界123');
      expect(result.success).toBe(true);
      expect(result.result).toContain('Hello');
      expect(result.result).toContain('123');
    });

    it('should handle multiple character phrases', () => {
      const result = s2t('发现发烧发明');
      expect(result.success).toBe(true);
      expect(result.result).toBe('發現發燒發明');
    });

    it('should include metadata in result', () => {
      const result = s2t('你好世界');
      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.duration).toBeDefined();
      expect(result.metadata?.inputLength).toBe(4);
      expect(result.metadata?.extra?.charsConverted).toBe(4);
    });

    it('should handle long text', () => {
      const longText = '中华民族是一个历史悠久的民族有着灿烂的文化和辉煌的历史';
      const result = s2t(longText);
      expect(result.success).toBe(true);
      expect(result.result).toBeTruthy();
      expect(result.result?.length).toBeGreaterThan(0);
    });

    it('should handle text with punctuation', () => {
      const result = s2t('你好，世界！这是测试。');
      expect(result.success).toBe(true);
      expect(result.result).toContain('，');
      expect(result.result).toContain('！');
      expect(result.result).toContain('。');
    });

    it('should handle 习 to 習', () => {
      const result = s2t('学习');
      expect(result.success).toBe(true);
      expect(result.result).toBe('學習');
    });

    it('should handle 无 to 無', () => {
      const result = s2t('无法');
      expect(result.success).toBe(true);
      expect(result.result).toBe('無法');
    });
  });

  describe('t2s (Traditional to Simplified)', () => {
    it('should convert 發 to 发', () => {
      const result = t2s('發展');
      expect(result.success).toBe(true);
      expect(result.result).toBe('发展');
    });

    it('should convert 頭髮 to 头发', () => {
      const result = t2s('頭髮');
      expect(result.success).toBe(true);
      expect(result.result).toBe('头发');
    });

    it('should convert 時鐘 to 时钟', () => {
      const result = t2s('時鐘');
      expect(result.success).toBe(true);
      expect(result.result).toBe('时钟');
    });

    it('should handle empty string', () => {
      const result = t2s('');
      expect(result.success).toBe(true);
      expect(result.result).toBe('');
    });

    it('should preserve non-Chinese characters', () => {
      const result = t2s('Hello世界123');
      expect(result.success).toBe(true);
      expect(result.result).toContain('Hello');
      expect(result.result).toContain('123');
    });

    it('should handle 學習 to 学习', () => {
      const result = t2s('學習');
      expect(result.success).toBe(true);
      expect(result.result).toBe('学习');
    });

    it('should handle 無法 to 无法', () => {
      const result = t2s('無法');
      expect(result.success).toBe(true);
      expect(result.result).toBe('无法');
    });

    it('should handle 發現發燒發明 to 发现发烧发明', () => {
      const result = t2s('發現發燒發明');
      expect(result.success).toBe(true);
      expect(result.result).toBe('发现发烧发明');
    });

    it('should include metadata in result', () => {
      const result = t2s('你好世界');
      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.duration).toBeDefined();
      expect(result.metadata?.inputLength).toBe(4);
    });

    it('should handle text with punctuation', () => {
      const result = t2s('你好，世界！這是測試。');
      expect(result.success).toBe(true);
      expect(result.result).toContain('，');
      expect(result.result).toContain('！');
      expect(result.result).toContain('。');
    });
  });

  describe('Round-trip conversion', () => {
    it('should be reversible for simple text', () => {
      const original = '你好世界';
      const toTraditional = s2t(original);
      expect(toTraditional.success).toBe(true);
      const backToSimplified = t2s(toTraditional.result!);
      expect(backToSimplified.success).toBe(true);
      expect(backToSimplified.result).toBe(original);
    });

    it('should be reversible for complex text', () => {
      const original = '中华民族是一个历史悠久的民族';
      const toTraditional = s2t(original);
      expect(toTraditional.success).toBe(true);
      const backToSimplified = t2s(toTraditional.result!);
      expect(backToSimplified.success).toBe(true);
      expect(backToSimplified.result).toBe(original);
    });
  });
});
