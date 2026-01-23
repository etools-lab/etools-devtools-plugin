# Implementation Plan: Developer Tools Plugin (ETools)

**Branch**: `001-dev-tools-plugin` | **Date**: 2026-01-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification for developer tools plugin with 40+ tools

## Summary

Extend the existing ETools Developer Tools plugin from 10 tools to 40+ tools, adding new categories including cryptography (AES/DES/SM3/SM4/Bcrypt), QR/barcode generation, Chinese pinyin conversion, regex testing, and code formatting. The plugin must support offline usage for 80% of tools.

## Technical Context

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| **Language** | TypeScript 5.3 | Existing codebase uses TS, strong typing for tool definitions |
| **UI Framework** | React 18+ | Already in use via `@etools/plugin-sdk` |
| **Build Tool** | tsup 8.0 | Already configured in project |
| **Testing** | Jest + React Testing Library | Standard for React components |
| **QR Generation** | `qrcode` npm package | Most popular, canvas/svg output, browser-compatible |
| **QR Parsing** | `@zxing/library` | Supports multiple formats, browser-compatible |
| **Barcode** | `JsBarcode` | Industry standard, 90+ formats, zero deps |
| **Pinyin** | `pinyin-pro` | Modern TS implementation, all features |
| **Bcrypt** | `bcryptjs` | Pure JS, browser-compatible, standard |
| **Code Format** | `prettier` + `sql-formatter` | Industry standards |
| **Target** | Chrome/Edge/Firefox extensions | ETools plugin ecosystem |
| **Offline** | Full support | All tools bundled, no CDN |

**Performance Goals**:
- Tool panel load: < 2 seconds
- Encoding operations: < 500ms
- QR/Barcode generation: < 200ms
- Bcrypt operations: < 500ms (async)
- Lazy load advanced tools

## Constitution Check

*Status: PASS - No constitution violations*

The project follows existing ETools plugin architecture:
- Uses `@etools/plugin-sdk` for UI components
- Follows plugin manifest pattern
- Implements search/action pattern
- Single package, no unnecessary complexity

## Project Structure

### Documentation

```text
specs/001-dev-tools-plugin/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical decisions
├── data-model.md        # Phase 1 output - entities and types
├── quickstart.md        # Phase 1 output - dev guide
├── contracts/           # Phase 1 output (not applicable - no external API)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── index.ts                    # Main plugin (existing)
├── ui.tsx                      # Main UI (existing)
├── ui.css                      # Styles (existing)
├── types.ts                    # Plugin types (existing)
├── tools/                      # NEW: Tool implementations
│   ├── index.ts               # Tool registry
│   ├── encoding/              # Base64, URL, Unicode, Hex
│   │   ├── base64.ts
│   │   ├── url.ts
│   │   ├── unicode.ts
│   │   └── hex.ts
│   ├── cryptography/          # Hash, Encrypt, Bcrypt
│   │   ├── hash.ts
│   │   ├── encrypt.ts
│   │   └── bcrypt.ts
│   ├── developer/             # JSON, Regex, Code format
│   │   ├── json.ts
│   │   ├── regex.ts
│   │   ├── sql.ts
│   │   └── cron.ts
│   ├── time/                  # Timestamp, Timezone
│   │   └── timestamp.ts
│   ├── generate/              # UUID, QR, Barcode
│   │   ├── uuid.ts
│   │   ├── qrcode.ts
│   │   └── barcode.ts
│   ├── convert/               # Pinyin, Case, Units
│   │   ├── pinyin.ts
│   │   ├── case.ts
│   │   └── units.ts
│   └── text/                  # Diff, Text process
│       ├── diff.ts
│       └── text.ts
├── components/                # NEW: Reusable UI components
│   ├── ToolCard.tsx
│   ├── ToolPanel.tsx
│   ├── InputArea.tsx
│   ├── OutputArea.tsx
│   └── ResultCard.tsx
├── hooks/                     # NEW: Custom hooks
│   ├── useTool.ts
│   ├── useClipboard.ts
│   └── useFileInput.ts
└── utils/                     # NEW: Utility functions
    ├── validation.ts
    └── helpers.ts

tests/
├── unit/                      # Unit tests for tools
├── integration/               # UI integration tests
└── e2e/                       # Plugin E2E tests
```

**Structure Decision**: Modular tool directory with categorization matching the UI. Shared components and hooks extracted for reuse.

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Refactor tool registry system
- [ ] Create ToolCard and ToolPanel components
- [ ] Implement tool selection and navigation
- [ ] Add new encoding tools (Unicode, Hex)
- [ ] Extend hash tools (SHA-512, SM3)

### Phase 2: Cryptography (Week 2)
- [ ] Add encryption/decryption (AES, DES)
- [ ] Add Bcrypt tools
- [ ] Add encryption mode selection UI
- [ ] Add key management UI

### Phase 3: Developer Tools (Week 2-3)
- [ ] JSON validation and error display
- [ ] JSON to CSV/GET params conversion
- [ ] Regex tester with match highlighting
- [ ] Cron validator
- [ ] JWT decoder

### Phase 4: Generation Tools (Week 3)
- [ ] QR code generator (text/url)
- [ ] QR code parser (file upload)
- [ ] Barcode generator (CODE128, EAN)
- [ ] UUID generator improvements

### Phase 5: Conversion Tools (Week 3-4)
- [ ] Pinyin converter (tones, initials)
- [ ] Simplified/Traditional Chinese
- [ ] Case converter (camel, kebab, snake)
- [ ] Base converter (2-64)

### Phase 6: Polish (Week 4)
- [ ] Error handling improvements
- [ ] Loading states and progress
- [ ] Copy to clipboard for all results
- [ ] Keyboard shortcuts
- [ ] Recent tools history
- [ ] Performance optimization

## Dependencies to Add

```json
{
  "dependencies": {
    "qrcode": "^1.5.4",
    "@zxing/library": "^0.21.3",
    "jsbarcode": "^3.11.6",
    "pinyin-pro": "^3.20.0",
    "bcryptjs": "^2.4.3",
    "prettier": "^3.3.0",
    "sql-formatter": "^15.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsbarcode": "^2.3.4"
  }
}
```

## Key Decisions

1. **Tool Registry Pattern**: Central registry with metadata, enabling:
   - Dynamic tool loading
   - Category-based filtering
   - Search keyword mapping
   - Offline capability flags

2. **Lazy Loading**: Advanced tools (QR parse, large formatters) loaded on demand:
   ```typescript
   const QRParser = lazy(() => import('./tools/generate/qr-parse'));
   ```

3. **Error Handling**: Consistent error interface across all tools:
   ```typescript
   { success: boolean; result?: string; error?: { message: string; position?: number } }
   ```

4. **State Management**: Local component state + recent tools in localStorage

## Out of Scope

- WebSocket debugging (requires backend)
- IP geolocation (requires online API)
- Complex file parsing (beyond simple text)
- User authentication/accounts

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bundle size too large | Performance | Lazy loading, tree shaking |
| Bcrypt slow in browser | UX | Web Worker for hashing |
| QR parsing camera access | Compatibility | Fallback to file upload |
| Unicode handling edge cases | Quality | Comprehensive test cases |
