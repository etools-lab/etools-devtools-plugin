# Research: Developer Tools Plugin Technical Decisions

## QR Code Generation

**Decision**: Use `qrcode` npm package

**Rationale**:
- Most popular QR code library for JavaScript (20M+ downloads/week)
- Supports both Canvas and SVG rendering
- Works in browser environment via ES modules
- No dependencies, lightweight (~50KB minified)
- Active maintenance and good documentation

**Alternatives considered**:
- `qrcode.react`: React-specific wrapper, not needed for this plugin
- `qrcodejs`: Older library, less maintained
- `EasyQRCodeJS`: More features but larger bundle size

**Usage**:
```typescript
import QRCode from 'qrcode';

QRCode.toDataURL(text, { width: 256, margin: 2 });
QRCode.toCanvas(canvas, text, options);
```

## QR Code Parsing

**Decision**: Use `@zxing/library`

**Rationale**:
- Supports 1D and 2D barcodes (QR, DataMatrix, etc.)
- Pure JavaScript, works in browser
- Actively maintained
- Comprehensive API for camera access and image decoding

**Alternatives considered**:
- `jsQR`: Only supports QR codes, smaller but less features
- `jsQrScanner`: Simpler API but less control

**Usage**:
```typescript
import { BrowserMultiFormatReader } from '@zxing/library';
const reader = new BrowserMultiFormatReader();
const result = await reader.decodeFromImageUrl(imageUrl);
```

## Barcode Generation

**Decision**: Use `JsBarcode`

**Rationale**:
- De facto standard for JavaScript barcode generation
- Supports 90+ barcode symbologies (CODE128, EAN, UPC, etc.)
- SVG output (scalable, easy to display)
- Zero dependencies, lightweight
- Works in all modern browsers

**Usage**:
```typescript
import JsBarcode from 'jsbarcode';

JsBarcode(canvas, text, {
  format: 'CODE128',
  width: 2,
  height: 100,
  displayValue: true
});
```

## Chinese Pinyin Conversion

**Decision**: Use `pinyin-pro`

**Rationale**:
- Modern TypeScript implementation
- Supports all features needed: tones, initials, separators
- Small bundle size (~100KB)
- No external dependencies
- Active maintenance

**Alternatives considered**:
- `pinyin4js`: Older, less maintained
- `cnchar`: Larger, more features but overkill for this use case

**Usage**:
```typescript
import { pinyin } from 'pinyin-pro';

pinyin('汉字', { toneType: 'symbol' }); // 'hàn zì'
pinyin('汉字', { toneType: 'none' });    // 'han zi'
pinyin('汉字', { type: 'array' });       // ['hàn', 'zì']
```

## Password Hashing (Bcrypt)

**Decision**: Use `bcryptjs`

**Rationale**:
- Pure JavaScript implementation, works in browser
- Industry standard for password hashing
- TypeScript support included
- Compatible with server-side bcrypt

**Alternatives considered**:
- `bcrypt-mini`: Smaller but less tested
- Native `bcrypt` (Node.js only): Not available in browser

**Usage**:
```typescript
import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, hash);
```

## Code Formatting

**Decision**: Use `prettier` for supported formats + custom parsers

**Rationale**:
- Prettier is the industry standard for code formatting
- Supports JSON, YAML, SQL, Markdown, CSS, etc.
- Can be used standalone without full Prettier CLI
- Consistent formatting across all tools

**For SQL formatting**: Use `sql-formatter` library
**For JSON/JSON5**: Native `JSON.stringify` with custom options

## Regular Expression Testing

**Decision**: Native JavaScript RegExp + custom UI

**Rationale**:
- JavaScript's native regex engine is sufficient
- No external library needed for matching
- Custom UI for highlighting matches and groups
- Support for replace with capture groups

## Offline Capability Summary

| Tool Category | Library | Offline | Bundle Impact |
|--------------|---------|---------|---------------|
| QR Code Gen | `qrcode` | Yes | ~50KB |
| QR Code Parse | `@zxing/library` | Yes | ~300KB |
| Barcode | `JsBarcode` | Yes | ~15KB |
| Pinyin | `pinyin-pro` | Yes | ~100KB |
| Bcrypt | `bcryptjs` | Yes | ~60KB |
| Code Format | `prettier` | Yes | ~3MB (shared) |

**Strategy**: Bundle all libraries, no CDN dependencies for offline support.

## Performance Targets

- QR code generation: < 100ms for standard size
- Barcode generation: < 50ms
- Pinyin conversion: < 50ms for 1000 characters
- Bcrypt hash: < 500ms (async, shouldn't block UI)
- Initial load: < 2 seconds (lazy load less common tools)
