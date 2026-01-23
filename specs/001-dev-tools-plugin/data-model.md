# Data Model: Developer Tools Plugin

## Core Entities

### Tool Definition

```typescript
interface Tool {
  id: string;              // Unique identifier (e.g., 'json-format', 'base64-encode')
  name: string;            // Display name
  icon: string;            // Emoji or icon string
  description: string;     // Short description
  category: ToolCategory;  // Category classification
  offlineSupported: boolean;
  triggerKeywords: string[];  // Search trigger prefixes
}
```

### Tool Category

```typescript
type ToolCategory =
  | 'encoding'      // Base64, URL, Unicode, Hex
  | 'cryptography'  // Hash, Encrypt/Decrypt
  | 'developer'     // JSON, Regex, Code format
  | 'time'          // Timestamp, Timezone
  | 'convert'       // Pinyin, Case, Units
  | 'generate'      // UUID, QR, Barcode
  | 'text'          // Diff, Text process
  | 'network'       // IP, JWT, etc.
```

### Conversion Result

```typescript
interface ConversionResult {
  type: 'success' | 'error';
  toolId: string;
  output?: string;
  error?: string;
  metadata?: {
    processingTime?: number;
    inputLength?: number;
    outputLength?: number;
  };
}
```

### Encoding Input/Output

```typescript
interface EncodingInput {
  text?: string;
  file?: File;
  encoding?: 'utf8' | 'gbk' | 'base64';
}

interface EncodingOutput {
  result: string;
  wasFile: boolean;
}
```

### Hash Input/Output

```typescript
interface HashInput {
  text: string;
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' | 'sm3';
}

interface HashOutput {
  algorithm: string;
  hash: string;
  uppercase: boolean;
}
```

### JSON Tools Input/Output

```typescript
interface JSONToolInput {
  text: string;
  options: {
    indent?: number;
    format?: 'pretty' | 'minified';
    escapeUnicode?: boolean;
    toCamelCase?: boolean;
    toSnakeCase?: boolean;
  };
}

interface JSONToolOutput {
  formatted?: string;
  error?: {
    message: string;
    position?: number;
    line?: number;
    column?: number;
  };
  stats?: {
    keys: number;
    depth: number;
    size: number;
  };
}
```

### Regex Test Input/Output

```typescript
interface RegexTestInput {
  pattern: string;
  flags: string;  // 'g', 'i', 'm', etc.
  testString: string;
  replacement?: string;
}

interface RegexMatch {
  full: string;
  groups: string[];
  index: number;
  length: number;
}

interface RegexTestOutput {
  matches: RegexMatch[];
  matchCount: number;
  replaceResult?: string;
  error?: string;
  isValid: boolean;
}
```

### QR/Barcode Output

```typescript
interface QRCodeOutput {
  dataUrl: string;
  svg?: string;
  size: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

interface BarcodeOutput {
  dataUrl: string;
  format: string;  // 'CODE128', 'EAN13', etc.
}
```

### Pinyin Output

```typescript
interface PinyinOutput {
  full: string;      // 'hàn yǔ pīn yīn'
  initials: string;  // 'hypy'
  array: string[];   // ['hàn', 'yǔ', 'pīn', 'yīn']
}
```

### State Management

```typescript
interface DevToolsState {
  selectedToolId: string | null;
  input: string;
  output: string;
  isLoading: boolean;
  error: string | null;
  recentTools: string[];
  toolPreferences: Record<string, object>;
}
```

## Tool Registry

```typescript
const TOOL_REGISTRY: Tool[] = [
  // Encoding
  { id: 'base64-encode', name: 'Base64 编码', icon: '🔐', category: 'encoding', offlineSupported: true, triggerKeywords: ['base64:'] },
  { id: 'base64-decode', name: 'Base64 解码', icon: '🔓', category: 'encoding', offlineSupported: true, triggerKeywords: ['base64:'] },
  { id: 'url-encode', name: 'URL 编码', icon: '🔗', category: 'encoding', offlineSupported: true, triggerKeywords: ['url:'] },
  { id: 'url-decode', name: 'URL 解码', icon: '🔗', category: 'encoding', offlineSupported: true, triggerKeywords: ['url:'] },
  { id: 'unicode-encode', name: 'Unicode 编码', icon: '🔡', category: 'encoding', offlineSupported: true, triggerKeywords: ['unicode:'] },
  { id: 'unicode-decode', name: 'Unicode 解码', icon: '🔡', category: 'encoding', offlineSupported: true, triggerKeywords: ['unicode:'] },
  { id: 'hex-encode', name: 'Hex 编码', icon: '🔢', category: 'encoding', offlineSupported: true, triggerKeywords: ['hex:'] },
  { id: 'hex-decode', name: 'Hex 解码', icon: '🔢', category: 'encoding', offlineSupported: true, triggerKeywords: ['hex:'] },

  // Cryptography
  { id: 'hash-md5', name: 'MD5 哈希', icon: '#️⃣', category: 'cryptography', offlineSupported: true, triggerKeywords: ['hash:'] },
  { id: 'hash-sha1', name: 'SHA-1 哈希', icon: '#️⃣', category: 'cryptography', offlineSupported: true, triggerKeywords: ['hash:'] },
  { id: 'hash-sha256', name: 'SHA-256 哈希', icon: '#️⃣', category: 'cryptography', offlineSupported: true, triggerKeywords: ['hash:'] },
  { id: 'hash-sha512', name: 'SHA-512 哈希', icon: '#️⃣', category: 'cryptography', offlineSupported: true, triggerKeywords: ['hash:'] },
  { id: 'hash-sm3', name: 'SM3 哈希', icon: '#️⃣', category: 'cryptography', offlineSupported: true, triggerKeywords: ['hash:'] },
  { id: 'bcrypt-hash', name: 'Bcrypt 加密', icon: '🔑', category: 'cryptography', offlineSupported: true, triggerKeywords: ['bcrypt:'] },
  { id: 'bcrypt-verify', name: 'Bcrypt 验证', icon: '✅', category: 'cryptography', offlineSupported: true, triggerKeywords: ['bcrypt:'] },

  // Developer
  { id: 'json-format', name: 'JSON 格式化', icon: '📋', category: 'developer', offlineSupported: true, triggerKeywords: ['json:'] },
  { id: 'json-validate', name: 'JSON 校验', icon: '✅', category: 'developer', offlineSupported: true, triggerKeywords: ['json:'] },
  { id: 'json-to-csv', name: 'JSON 转 CSV', icon: '📊', category: 'developer', offlineSupported: true, triggerKeywords: ['json:'] },
  { id: 'regex-test', name: '正则测试', icon: '🔍', category: 'developer', offlineSupported: true, triggerKeywords: ['regex:', 're:'] },
  { id: 'cron-validate', name: 'Crontab 校验', icon: '⏰', category: 'developer', offlineSupported: true, triggerKeywords: ['cron:'] },
  { id: 'jwt-decode', name: 'JWT 解码', icon: '🎫', category: 'developer', offlineSupported: true, triggerKeywords: ['jwt:'] },
  { id: 'var-case', name: '变量名转换', icon: '🔄', category: 'developer', offlineSupported: true, triggerKeywords: ['case:'] },

  // Time
  { id: 'ts-to-date', name: '时间戳转日期', icon: '🕐', category: 'time', offlineSupported: true, triggerKeywords: ['ts:', 'time:'] },
  { id: 'date-to-ts', name: '日期转时间戳', icon: '📅', category: 'time', offlineSupported: true, triggerKeywords: ['ts:', 'time:'] },

  // Generate
  { id: 'uuid-gen', name: 'UUID 生成', icon: '🆔', category: 'generate', offlineSupported: true, triggerKeywords: ['uuid:'] },
  { id: 'qr-gen', name: '二维码生成', icon: '📱', category: 'generate', offlineSupported: true, triggerKeywords: ['qr:'] },
  { id: 'qr-parse', name: '二维码解析', icon: '📷', category: 'generate', offlineSupported: true, triggerKeywords: ['qr:'] },
  { id: 'barcode-gen', name: '条形码生成', icon: '📊', category: 'generate', offlineSupported: true, triggerKeywords: ['barcode:'] },

  // Convert
  { id: 'pinyin-convert', name: '汉字转拼音', icon: '🈳', category: 'convert', offlineSupported: true, triggerKeywords: ['pinyin:'] },
  { id: 's2t', name: '简体转繁体', icon: '繁', category: 'convert', offlineSupported: true, triggerKeywords: ['s2t'] },
  { id: 't2s', name: '繁体转简体', icon: '简', category: 'convert', offlineSupported: true, triggerKeywords: ['t2s'] },
  { id: 'number-base', name: '进制转换', icon: '🔢', category: 'convert', offlineSupported: true, triggerKeywords: ['base:'] },

  // Text
  { id: 'text-diff', name: '文本对比', icon: '📝', category: 'text', offlineSupported: true, triggerKeywords: ['diff:'] },
  { id: 'text-case', name: '大小写转换', icon: '🔤', category: 'text', offlineSupported: true, triggerKeywords: ['case:'] },
  { id: 'char-count', name: '字符统计', icon: '🔢', category: 'text', offlineSupported: true, triggerKeywords: ['count:'] },
];
```
