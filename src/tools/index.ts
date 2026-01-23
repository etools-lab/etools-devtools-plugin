import type { Tool, ToolCategory } from '../types';

/**
 * Tool registry for the Developer Tools plugin
 */

export { type Tool, type ToolCategory };

// All available tools
export const TOOLS: Tool[] = [
  // Encoding tools
  {
    id: 'json-format',
    name: 'JSON 格式化',
    icon: '📋',
    description: '格式化 JSON 并美化输出',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['json:', 'json-format:', 'dev:'],
  },
  {
    id: 'json-validate',
    name: 'JSON 验证',
    icon: '✅',
    description: '验证 JSON 格式并显示错误位置',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['json-validate:', 'dev:'],
  },
  {
    id: 'base64-encode',
    name: 'Base64 编码',
    icon: '🔐',
    description: '将文本编码为 Base64',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['base64:', 'base64-encode:', 'dev:'],
  },
  {
    id: 'base64-decode',
    name: 'Base64 解码',
    icon: '🔓',
    description: '将 Base64 解码为文本',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['base64-decode:', 'dev:'],
  },
  {
    id: 'url-encode',
    name: 'URL 编码',
    icon: '🔗',
    description: '对 URL 组件进行编码',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['url:', 'url-encode:', 'dev:'],
  },
  {
    id: 'url-decode',
    name: 'URL 解码',
    icon: '🔗',
    description: '对 URL 组件进行解码',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['url-decode:', 'dev:'],
  },
  {
    id: 'unicode-encode',
    name: 'Unicode 编码',
    icon: '🔤',
    description: '将文本转换为 \\uXXXX 格式',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['unicode:', 'unicode-encode:', 'dev:'],
  },
  {
    id: 'unicode-decode',
    name: 'Unicode 解码',
    icon: '🔤',
    description: '将 \\uXXXX 格式转换为文本',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['unicode-decode:', 'dev:'],
  },
  {
    id: 'hex-encode',
    name: 'Hex 编码',
    icon: '🔢',
    description: '将文本转换为十六进制',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['hex:', 'hex-encode:', 'dev:'],
  },
  {
    id: 'hex-decode',
    name: 'Hex 解码',
    icon: '🔢',
    description: '将十六进制转换为文本',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['hex-decode:', 'dev:'],
  },
  // Cryptography tools
  {
    id: 'hash-md5',
    name: 'MD5 哈希',
    icon: '#️⃣',
    description: '生成 MD5 哈希值',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['hash:', 'md5:', 'hash:md5', 'dev:'],
  },
  {
    id: 'hash-sha1',
    name: 'SHA-1 哈希',
    icon: '#️⃣',
    description: '生成 SHA-1 哈希值',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['hash:', 'sha1:', 'sha-1:', 'hash:sha1', 'dev:'],
  },
  {
    id: 'hash-sha256',
    name: 'SHA-256 哈希',
    icon: '#️⃣',
    description: '生成 SHA-256 哈希值',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['hash:', 'sha256:', 'sha-256:', 'hash:sha256', 'dev:'],
  },
  {
    id: 'hash-sha512',
    name: 'SHA-512 哈希',
    icon: '#️⃣',
    description: '生成 SHA-512 哈希值',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['hash:', 'sha512:', 'sha-512:', 'hash:sha512', 'dev:'],
  },
  {
    id: 'hash-sm3',
    name: 'SM3 哈希',
    icon: '#️⃣',
    description: '生成 SM3 哈希值 (国密)',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['hash:', 'sm3:', 'hash:sm3', 'dev:'],
  },
  {
    id: 'aes-encrypt',
    name: 'AES 加密',
    icon: '🔒',
    description: '使用 AES 加密文本',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['aes:', 'aes-encrypt:', 'encrypt:', 'dev:'],
  },
  {
    id: 'aes-decrypt',
    name: 'AES 解密',
    icon: '🔓',
    description: '使用 AES 解密文本',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['aes-decrypt:', 'decrypt:', 'dev:'],
  },
  {
    id: 'bcrypt-hash',
    name: 'Bcrypt 哈希',
    icon: '🔐',
    description: '生成 Bcrypt 哈希',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['bcrypt:', 'bcrypt-hash:', 'dev:'],
  },
  {
    id: 'bcrypt-verify',
    name: 'Bcrypt 验证',
    icon: '✅',
    description: '验证 Bcrypt 哈希',
    category: 'cryptography',
    offlineSupported: true,
    triggerKeywords: ['bcrypt-verify:', 'verify:', 'dev:'],
  },
  // Developer tools
  {
    id: 'sql-format',
    name: 'SQL 格式化',
    icon: '🗃️',
    description: '格式化 SQL 语句',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['sql:', 'sql-format:', 'dev:'],
  },
  {
    id: 'yaml-format',
    name: 'YAML 格式化',
    icon: '📄',
    description: '格式化 YAML',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['yaml:', 'yaml-format:', 'dev:'],
  },
  {
    id: 'xml-format',
    name: 'XML 格式化',
    icon: '📄',
    description: '格式化 XML',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['xml:', 'xml-format:', 'dev:'],
  },
  {
    id: 'regex-test',
    name: '正则测试',
    icon: '🔍',
    description: '测试正则表达式',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['regex:', 're:', 'regex-test:', 'dev:'],
  },
  {
    id: 'json-to-csv',
    name: 'JSON 转 CSV',
    icon: '📊',
    description: '将 JSON 数组转换为 CSV',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['json-csv:', 'json-to-csv:', 'dev:'],
  },
  {
    id: 'json-to-get',
    name: 'JSON 转 GET',
    icon: '🔗',
    description: '将 JSON 转换为 URL 参数',
    category: 'developer',
    offlineSupported: true,
    triggerKeywords: ['json-get:', 'json-to-get:', 'dev:'],
  },
  // Time tools
  {
    id: 'ts-to-date',
    name: '时间戳转日期',
    icon: '🕐',
    description: '将时间戳转换为日期',
    category: 'time',
    offlineSupported: true,
    triggerKeywords: ['ts:', 'timestamp:', 'ts-to-date:', 'dev:'],
  },
  {
    id: 'date-to-ts',
    name: '日期转时间戳',
    icon: '🕐',
    description: '将日期转换为时间戳',
    category: 'time',
    offlineSupported: true,
    triggerKeywords: ['date-to-ts:', 'dev:'],
  },
  // Generate tools
  {
    id: 'uuid-gen',
    name: 'UUID 生成',
    icon: '🆔',
    description: '生成 UUID v4',
    category: 'generate',
    offlineSupported: true,
    triggerKeywords: ['uuid:', 'uuid-gen:', 'dev:'],
  },
  {
    id: 'qrcode-gen',
    name: '二维码生成',
    icon: '📱',
    description: '生成二维码',
    category: 'generate',
    offlineSupported: true,
    triggerKeywords: ['qr:', 'qrcode:', 'qr-gen:', 'dev:'],
  },
  {
    id: 'qrcode-parse',
    name: '二维码解析',
    icon: '📷',
    description: '解析二维码图片',
    category: 'generate',
    offlineSupported: true,
    triggerKeywords: ['qr-parse:', 'qr-decode:', 'dev:'],
  },
  {
    id: 'barcode-gen',
    name: '条形码生成',
    icon: '📊',
    description: '生成条形码',
    category: 'generate',
    offlineSupported: true,
    triggerKeywords: ['barcode:', 'barcode-gen:', 'dev:'],
  },
  // Convert tools
  {
    id: 'pinyin-convert',
    name: '拼音转换',
    icon: '🈵',
    description: '中文转拼音',
    category: 'convert',
    offlineSupported: true,
    triggerKeywords: ['pinyin:', 'pinyin-convert:', 'dev:'],
  },
  {
    id: 's2t-convert',
    name: '简体转繁体',
    icon: '繁',
    description: '简体中文转繁体中文',
    category: 'convert',
    offlineSupported: true,
    triggerKeywords: ['s2t:', 'simplified:', 'dev:'],
  },
  {
    id: 't2s-convert',
    name: '繁体转简体',
    icon: '简',
    description: '繁体中文转简体中文',
    category: 'convert',
    offlineSupported: true,
    triggerKeywords: ['t2s:', 'traditional:', 'dev:'],
  },
];

// All unique categories
export const CATEGORIES: ToolCategory[] = [
  'encoding',
  'cryptography',
  'developer',
  'time',
  'convert',
  'generate',
];

// Category to tools mapping
export const TOOLS_BY_CATEGORY: Record<ToolCategory, Tool[]> = {
  encoding: TOOLS.filter((t) => t.category === 'encoding'),
  cryptography: TOOLS.filter((t) => t.category === 'cryptography'),
  developer: TOOLS.filter((t) => t.category === 'developer'),
  time: TOOLS.filter((t) => t.category === 'time'),
  convert: TOOLS.filter((t) => t.category === 'convert'),
  generate: TOOLS.filter((t) => t.category === 'generate'),
  text: [],
  network: [],
};

/**
 * Get tool by ID
 */
export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

/**
 * Search tools by keyword
 */
export function searchTools(query: string): Tool[] {
  const normalizedQuery = query.toLowerCase();
  return TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.triggerKeywords.some((kw) => kw.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Get all trigger keywords from all tools
 */
export function getAllTriggerKeywords(): string[] {
  const keywords = new Set<string>();
  TOOLS.forEach((tool) => {
    tool.triggerKeywords.forEach((kw) => keywords.add(kw));
  });
  return Array.from(keywords);
}
