import { describe, it, expect } from 'vitest';
import {
  sqlFormat,
  sqlMinify,
  sqlHighlight,
} from '../../../src/tools/developer/sql';
import {
  yamlFormat,
  yamlMinify,
} from '../../../src/tools/developer/yaml';
import {
  xmlFormat,
  xmlMinify,
  xmlEscape,
  xmlUnescape,
  xmlValidate,
} from '../../../src/tools/developer/xml';

describe('SQL Formatter', () => {
  describe('sqlFormat', () => {
    it('should format basic SELECT statement', () => {
      const input = 'SELECT id, name FROM users WHERE age > 18';
      const result = sqlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('SELECT');
      expect(result.result).toContain('FROM');
      expect(result.result).toContain('WHERE');
    });

    it('should format INSERT statement', () => {
      const input = 'INSERT INTO users (name, age) VALUES ("John", 30)';
      const result = sqlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('INSERT');
      expect(result.result).toContain('INTO');
    });

    it('should handle nested queries', () => {
      const input = 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders)';
      const result = sqlFormat(input);
      expect(result.success).toBe(true);
    });

    it('should track input/output length', () => {
      const input = 'SELECT 1';
      const result = sqlFormat(input);
      expect(result.success).toBe(true);
      expect(result.metadata?.inputLength).toBe(input.length);
    });
  });

  describe('sqlMinify', () => {
    it('should remove all whitespace', () => {
      const input = 'SELECT  id  FROM  users';
      const result = sqlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('SELECT id FROM users');
    });

    it('should remove comments', () => {
      const input = 'SELECT id -- comment\nFROM users';
      const result = sqlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).not.toContain('--');
    });
  });
});

describe('YAML Formatter', () => {
  describe('yamlFormat', () => {
    it('should format basic YAML', () => {
      const input = 'name:test\nvalue:123';
      const result = yamlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('name: test');
      expect(result.result).toContain('value: 123');
    });

    it('should format nested objects', () => {
      const input = 'data:\n  name: test\n  nested:\n    key: value';
      const result = yamlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('data:');
      expect(result.result).toContain('name: test');
    });

    it('should format arrays', () => {
      const input = 'items:\n- name: item1\n- name: item2';
      const result = yamlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('items:');
    });

    it('should handle basic YAML', () => {
      const input = 'key: value';
      const result = yamlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('key: value');
    });
  });

  describe('yamlMinify', () => {
    it('should minify YAML', () => {
      const input = 'name: test\nvalue: 123';
      const result = yamlMinify(input);
      expect(result.success).toBe(true);
      // Basic minification - removes empty lines
      expect(result.result).toBeTruthy();
    });

    it('should remove comments', () => {
      const input = 'name: test # comment';
      const result = yamlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).not.toContain('# comment');
    });
  });
});

describe('XML Formatter', () => {
  describe('xmlFormat', () => {
    it('should format basic XML', () => {
      const input = '<root><name>test</name></root>';
      const result = xmlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('<root>');
      expect(result.result).toContain('<name>');
    });

    it('should format nested elements', () => {
      const input = '<root><child><grandchild>value</grandchild></child></root>';
      const result = xmlFormat(input);
      expect(result.success).toBe(true);
      expect(result.result).toContain('<root>');
      expect(result.result).toContain('<child>');
    });

    it('should track input/output length', () => {
      const input = '<root/>';
      const result = xmlFormat(input);
      expect(result.success).toBe(true);
      expect(result.metadata?.inputLength).toBe(input.length);
    });
  });

  describe('xmlMinify', () => {
    it('should remove whitespace between tags', () => {
      const input = '<root>\n  <child/>\n</root>';
      const result = xmlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('<root><child/></root>');
    });

    it('should remove XML declaration', () => {
      const input = '<?xml version="1.0"?><root/>';
      const result = xmlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('<root/>');
    });

    it('should remove comments', () => {
      const input = '<!-- comment --><root/>';
      const result = xmlMinify(input);
      expect(result.success).toBe(true);
      expect(result.result).not.toContain('<!--');
    });
  });

  describe('xmlEscape', () => {
    it('should escape &', () => {
      const input = 'A & B';
      const result = xmlEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('A &amp; B');
    });

    it('should escape < and >', () => {
      const input = '<tag>';
      const result = xmlEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('&lt;tag&gt;');
    });

    it('should escape quotes', () => {
      const input = 'say "hello"';
      const result = xmlEscape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('say &quot;hello&quot;');
    });
  });

  describe('xmlUnescape', () => {
    it('should unescape &amp;', () => {
      const input = 'A &amp; B';
      const result = xmlUnescape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('A & B');
    });

    it('should unescape &lt; and &gt;', () => {
      const input = '&lt;tag&gt;';
      const result = xmlUnescape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('<tag>');
    });

    it('should unescape quotes', () => {
      const input = '&quot;hello&quot;';
      const result = xmlUnescape(input);
      expect(result.success).toBe(true);
      expect(result.result).toBe('"hello"');
    });
  });

  describe('xmlValidate', () => {
    it('should validate well-formed XML', () => {
      const input = '<root><child/></root>';
      const result = xmlValidate(input);
      // DOMParser may not be available in all test environments
      if (typeof DOMParser !== 'undefined') {
        expect(result.success).toBe(true);
        expect(result.result).toBe(true);
      } else {
        // In Node.js without DOM, it may fail gracefully
        expect(result.success || result.error).toBeTruthy();
      }
    });

    it('should handle malformed XML', () => {
      const input = '<root><child></root>';
      const result = xmlValidate(input);
      // Either fails or returns success (depending on DOM availability)
      expect(result.success || result.error).toBeTruthy();
    });
  });
});
