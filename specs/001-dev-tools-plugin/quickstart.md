# Quick Start Guide: Developer Tools Plugin

## Setup

```bash
# Install dependencies
npm install

# Add new dependencies for this feature
npm install qrcode @zxing/library jsbarcode pinyin-pro bcryptjs prettier sql-formatter
npm install -D @types/bcryptjs @types/jsbarcode

# Development (watch mode)
npm run dev

# Build
npm run build
```

## Project Structure Overview

```
src/
├── index.ts              # Plugin entry, exports manifest, onSearch, executeAction
├── ui.tsx                # Main React component for plugin UI
├── tools/                # Tool implementations by category
│   ├── index.ts          # Tool registry and exports
│   ├── encoding/         # Base64, URL, Unicode, Hex tools
│   ├── cryptography/     # Hash, encryption, bcrypt tools
│   ├── developer/        # JSON, regex, SQL, cron tools
│   ├── time/             # Timestamp tools
│   ├── generate/         # UUID, QR code, barcode tools
│   ├── convert/          # Pinyin, case, unit conversion
│   └── text/             # Text diff, processing tools
└── components/           # Reusable UI components
```

## Adding a New Tool

### 1. Create the Tool Function

Create a new file in the appropriate category, e.g., `src/tools/encoding/morse.ts`:

```typescript
/**
 * Morse code encoder/decoder
 */

export interface MorseResult {
  success: boolean;
  result?: string;
  error?: string;
}

export function morseEncode(text: string): MorseResult {
  const MORSE_CODE: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', // ... etc
  };

  try {
    const upper = text.toUpperCase();
    const morse = upper
      .split('')
      .map(c => c === ' ' ? '/' : MORSE_CODE[c] || '')
      .join(' ');

    return { success: true, result: morse };
  } catch (error) {
    return { success: false, error: 'Invalid input' };
  }
}

export function morseDecode(morse: string): MorseResult {
  // Reverse mapping implementation
}
```

### 2. Register in Tool Registry

Edit `src/tools/index.ts`:

```typescript
import { morseEncode, morseDecode } from './encoding/morse';

export const TOOLS = [
  // ... existing tools

  // Add new tool
  {
    id: 'morse-encode',
    name: '莫尔斯电码编码',
    icon: '📡',
    description: '将文本编码为莫尔斯电码',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['morse:'],
    execute: morseEncode,
  },
  {
    id: 'morse-decode',
    name: '莫尔斯电码解码',
    icon: '📡',
    description: '将莫尔斯电码解码为文本',
    category: 'encoding',
    offlineSupported: true,
    triggerKeywords: ['morse:'],
    execute: morseDecode,
  },
];
```

### 3. Add Search Trigger (if needed)

Edit `src/index.ts` `onSearch` function:

```typescript
if (query.startsWith('morse:') || query.startsWith('dev:')) {
  results.push({
    id: 'morse-encode',
    title: 'Morse Encode',
    description: 'Encode text to Morse code',
    icon: '📡',
    actionData: {
      type: 'open-ui',
      pluginId: 'devtools',
      toolId: 'morse-encode',
      query: cleanQuery,
    },
  });
}
```

### 4. Add to UI (Optional - if tool needs special UI)

Edit `src/ui.tsx` tools array:

```typescript
const tools = [
  // ... existing tools
  { id: 'morse-encode', name: '莫尔斯编码', icon: '📡', description: '文本转莫尔斯电码' },
  { id: 'morse-decode', name: '莫尔斯解码', icon: '📡', description: '莫尔斯电码转文本' },
];
```

Add handler in `handleExecute`:

```typescript
case 'morse-encode': {
  const result = morseEncode(input);
  toolResult = {
    type: 'morse-encode',
    success: result.success,
    result: result.result,
    error: result.error,
  };
  break;
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- encoding.test.ts

# Run with coverage
npm test -- --coverage
```

## Building for Production

```bash
# Build plugin
npm run build

# Build with UI
npm run build:ui

# Output in dist/
```

## Common Patterns

### Error Handling

All tools should return consistent error format:

```typescript
{ success: boolean; result?: string; error?: string }
```

### Async Operations

For slow operations (bcrypt, large file processing), use async/await and consider Web Workers.

### Type Exports

Export types from `src/types.ts` for shared interfaces:

```typescript
export interface ToolResult {
  type: string;
  success: boolean;
  result?: string;
  error?: string;
}
```

## Development Workflow

1. Create tool function with tests
2. Register in tool registry
3. Add search triggers in `index.ts`
4. Add UI elements in `ui.tsx`
5. Run tests and build
6. Verify in local ETools environment
