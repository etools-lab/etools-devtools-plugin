import { describe, it, expect } from 'vitest';
import {
  jsonFormat,
  jsonValidate,
  jsonToCsv,
  jsonToGetParams,
  jsonEscape,
  jsonUnescape,
  jsonMinify,
} from '../../../src/tools/developer/json';

describe('JSON Tools', () => {
  describe('jsonFormat', () => {
    it('should format valid JSON with 2-space indent', () => {
      const input = '{"name":"test","value":123}';
      const result = jsonFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('{\n  "name": "test",\n  "value": 123\n}');
    });

    it('should format nested JSON', () => {
      const input = '{"data":{"items":[{"id":1},{"id":2}]}}';
      const result = jsonFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('"data"');
      expect(result.result).toContain('"items"');
    });

    it('should return error for invalid JSON', () => {
      const input = '{invalid json}';
      const result = jsonFormat(input);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should track input/output length in metadata', () => {
      const input = '{"test":true}';
      const result = jsonFormat(input);
      expect(result.success).toBe(true);
      expect(result.metadata?.inputLength).toBe(input.length);
      expect(result.metadata?.outputLength).toBe(result.result?.length);
    });
  });

  describe('jsonValidate', () => {
    it('should validate valid JSON', () => {
      const input = '{"name":"test"}';
      const result = jsonValidate(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });

    it('should reject invalid JSON', () => {
      const input = '{broken';
      const result = jsonValidate(input);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should provide error location for invalid JSON', () => {
      const input = '{"name":"test" missingColon}';
      const result = jsonValidate(input);
      expect(result.success).toBe(false);
      expect(result.metadata?.errorLocation).toBeDefined();
      expect(result.metadata?.errorLocation?.line).toBeGreaterThan(0);
    });

    it('should validate JSON arrays', () => {
      const input = '[1, 2, 3]';
      const result = jsonValidate(input);
      expect(result.success).toBe(true);
    });
  });

  describe('jsonToCsv', () => {
    it('should convert array of objects to CSV', () => {
      const input = '[{"name":"John","age":30},{"name":"Jane","age":25}]';
      const result = jsonToCsv(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('"name"');
      expect(result.result).toContain('"age"');
      expect(result.result).toContain('John');
      expect(result.result).toContain('Jane');
    });

    it('should convert single object to CSV', () => {
      const input = '{"name":"John","age":30}';
      const result = jsonToCsv(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('name');
      expect(result.result).toContain('John');
    });

    it('should handle empty arrays', () => {
      const input = '[]';
      const result = jsonToCsv(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('');
    });

    it('should return error for invalid JSON', () => {
      const input = 'not json';
      const result = jsonToCsv(input);
      expect(result.success).toBe(false);
    });

    it('should escape values containing commas', () => {
      const input = '[{"name":"John, Jr.","age":30}]';
      const result = jsonToCsv(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('"John, Jr."');
    });

    it('should track rows and columns in metadata', () => {
      const input = '[{"a":1},{"a":2}]';
      const result = jsonToCsv(input);
      expect(result.success).toBe(true);
      expect(result.metadata?.extra?.rows).toBe(2);
      expect(result.metadata?.extra?.columns).toBe(1);
    });
  });

  describe('jsonToGetParams', () => {
    it('should convert object to URL parameters', () => {
      const input = '{"name":"test","value":"hello"}';
      const result = jsonToGetParams(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('name=test');
      expect(result.result).toContain('value=hello');
    });

    it('should handle nested objects', () => {
      const input = '[{"name":"john","age":30},{"name":"jane","age":25}]';
      const result = jsonToGetParams(input);
      expect(result.success).toBe(true);
      // URL encoded format: name[0]=john
      expect(result.result).toContain('name%5B0%5D=john');
    });

    it('should encode special characters', () => {
      const input = '{"query":"hello world"}';
      const result = jsonToGetParams(input);
      expect(result.success).toBe(true);
      // Can be either + or %20 depending on browser
      expect(result.result).toMatch(/query=(hello%20world|hello\+world)/);
    });

    it('should return error for invalid JSON', () => {
      const input = 'broken';
      const result = jsonToGetParams(input);
      expect(result.success).toBe(false);
    });
  });

  describe('jsonEscape', () => {
    it('should escape JSON string', () => {
      const input = 'hello "world"';
      const result = jsonEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('hello \\"world\\"');
    });

    it('should escape newlines', () => {
      const input = 'line1\nline2';
      const result = jsonEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('line1\\nline2');
    });

    it('should escape backslashes', () => {
      const input = 'path\\to\\file';
      const result = jsonEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('path\\\\to\\\\file');
    });
  });

  describe('jsonUnescape', () => {
    it('should unescape JSON string', () => {
      const input = 'hello \\"world\\"';
      const result = jsonUnescape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('hello "world"');
    });

    it('should unescape newlines', () => {
      const input = 'line1\\nline2';
      const result = jsonUnescape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('line1\nline2');
    });

    it('should return error for invalid escape sequences', () => {
      const input = '\\x'; // Invalid escape
      const result = jsonUnescape(input);
      expect(result.success).toBe(false);
    });
  });

  describe('jsonMinify', () => {
    it('should minify JSON by removing whitespace', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const result = jsonMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"name":"test","value":123}');
    });

    it('should return error for invalid JSON', () => {
      const input = '{invalid}';
      const result = jsonMinify(input);
      expect(result.success).toBe(false);
    });
  });
});
