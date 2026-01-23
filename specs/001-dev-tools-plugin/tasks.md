# Tasks: Developer Tools Plugin (ETools)

**Feature**: 001-dev-tools-plugin | **Generated**: 2026-01-22 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Summary

- **Total Tasks**: 85
- **User Stories**: 10 (4 P1, 6 P2)
- **MVP Scope**: User Story 1 (Quick Access to Developer Tools) + Foundation setup
- **Parallel Opportunities**: 15+ tasks can run in parallel across different tool categories

## Dependencies & Execution Order

### Story Completion Order

```text
Phase 1: Setup
    ↓
Phase 2: Foundational (Tool Registry, Components, Hooks)
    ↓
Phase 3: [US1] Quick Access UI + [US2] Encoding Tools (parallel after foundational)
    ↓
Phase 4: [US3] Cryptography Tools
    ↓
Phase 5: [US4] JSON Tools + [US5] Code Formatting (parallel)
    ↓
Phase 6: [US6] Regex Testing + [US7] Time Tools (parallel)
    ↓
Phase 7: [US8] QR/Barcode + [US9] Pinyin (parallel)
    ↓
Phase 8: [US10] Offline Support + Polish
```

### Parallel Execution Examples

- T006, T007, T008 can run in parallel (different component files)
- T020, T021, T022 can run in parallel (different encoding tools)
- T034, T035 can run in parallel (different encryption tools)
- T048, T049 can run in parallel (JSON format and validate)

## Phase 1: Setup

**Goal**: Initialize project dependencies and update build configuration

**Independent Test Criteria**: `npm install` completes successfully, build passes

### Tasks

- [ ] T001 Install new dependencies for qrcode, @zxing/library, jsbarcode, pinyin-pro, bcryptjs, prettier, sql-formatter in package.json
- [ ] T002 [P] Install dev dependencies @types/bcryptjs, @types/jsbarcode in package.json
- [ ] T003 [P] Update tsup.config.ts to include new external dependencies if needed
- [ ] T004 [P] Create directory structure src/tools/{encoding,cryptography,developer,time,generate,convert,text}/
- [ ] T005 [P] Create directory structure src/components/, src/hooks/, src/utils/

## Phase 2: Foundational

**Goal**: Create tool registry system, reusable components, and hooks that all tools depend on

**Independent Test Criteria**: ToolRegistry exports all tools, UI components render without errors

### Tasks

- [ ] T006 Create Tool interface in src/types.ts with id, name, icon, description, category, offlineSupported, triggerKeywords
- [ ] T007 [P] Create ConversionResult interface in src/types.ts with success, result, error, metadata
- [ ] T008 [P] Create ToolCategory type in src/types.ts for encoding, cryptography, developer, time, convert, generate, text, network
- [ ] T009 Create ToolCard component in src/components/ToolCard.tsx for displaying tool in grid
- [ ] T010 [P] Create ToolPanel component in src/components/ToolPanel.tsx for category-based tool navigation
- [ ] T011 [P] Create InputArea component in src/components/InputArea.tsx for text/file input
- [ ] T012 [P] Create OutputArea component in src/components/OutputArea.tsx for displaying results
- [ ] T013 [P] Create ResultCard component in src/components/ResultCard.tsx for error/success display
- [ ] T014 Create useTool hook in src/hooks/useTool.ts for tool execution logic
- [ ] T015 [P] Create useClipboard hook in src/hooks/useClipboard.ts for copy functionality
- [ ] T016 [P] Create useFileInput hook in src/hooks/useFileInput.ts for handling file upload
- [ ] T017 Create validation utilities in src/utils/validation.ts for input validation
- [ ] T018 [P] Create helper functions in src/utils/helpers.ts for common operations
- [ ] T019 Create tool registry index in src/tools/index.ts with TOOLS array and getToolById function

## Phase 3: [US1] Quick Access + [US2] Encoding Tools

**Goal**: Implement tool navigation UI and encoding/decoding tools (Base64, URL, Unicode, Hex)

**Independent Test Criteria**: User can browse tools by category, select any tool, and perform Base64 encode/decode, URL encode/decode, Unicode encode/decode, Hex encode/decode

### User Story 1: Quick Access to Developer Tools

- [x] T020 [US1] Create category-based tool list in src/tools/index.ts with encoding, cryptography, developer, time, convert, generate, text categories
- [x] T021 [US1] Add search trigger handlers in src/index.ts for new tool keywords (unicode:, hex:, pinyin:, qr:, barcode:, etc.)
- [x] T022 [US1] Refactor ui.tsx to use ToolCard and ToolPanel components for tool selection
- [x] T023 [US1] Add category tabs in ui.tsx for filtering tools by category
- [x] T024 [US1] Implement tool selection state management in ui.tsx with recentTools tracking in localStorage

### User Story 2: Encoding/Decoding Tools

- [x] T025 [US2] Create Base64 encode/decode functions in src/tools/encoding/base64.ts with file support
- [x] T026 [US2] Create URL encode/decode functions in src/tools/encoding/url.ts
- [x] T027 [US2] Create Unicode encode/decode functions in src/tools/encoding/unicode.ts for text to/from \uXXXX format
- [x] T028 [US2] Create Hex encode/decode functions in src/tools/encoding/hex.ts for string to/from hex bytes
- [x] T029 [US2] Add encoding tool handlers in ui.tsx switch statement for base64-encode, base64-decode, url-encode, url-decode, unicode-encode, unicode-decode, hex-encode, hex-decode
- [x] T030 [US2] Add search results in src/index.ts for encoding tools with trigger keywords
- [x] T031 [US2] Add unit tests in tests/unit/encoding/ for all encoding functions

## Phase 4: [US3] Cryptography Tools

**Goal**: Implement hash generation, encryption/decryption, and bcrypt tools

**Independent Test Criteria**: User can generate MD5/SHA/SM3 hashes, perform AES/DES encrypt/decrypt, and use bcrypt for password hashing and verification

### User Story 3: Cryptographic Tools

- [ ] T032 [US3] Create hash functions in src/tools/cryptography/hash.ts for md5, sha1, sha256, sha512, sm3 algorithms
- [ ] T033 [US3] Implement SM3 hash using Web Crypto API or pure JS implementation in hash.ts
- [ ] T034 [US3] Create AES encrypt/decrypt functions in src/tools/cryptography/encrypt.ts with CBC mode
- [ ] T035 [US3] Create DES encrypt/decrypt functions in src/tools/cryptography/encrypt.ts
- [ ] T036 [US3] Create bcrypt hash/verify functions in src/tools/cryptography/bcrypt.ts using bcryptjs
- [ ] T037 [US3] Add encryption mode and key input UI in ui.tsx for key management
- [ ] T038 [US3] Add cryptography tool handlers in ui.tsx switch statement for all hash and encryption tools
- [ ] T039 [US3] Add search results in src/index.ts for hash:, bcrypt: triggers
- [ ] T040 [US3] Add unit tests in tests/unit/cryptography/ for hash, encrypt, bcrypt functions

## Phase 5: [US4] JSON Tools + [US5] Code Formatting

**Goal**: Implement JSON formatting/validation/conversion and code formatting for SQL/XML/YAML

**Independent Test Criteria**: User can format JSON, validate with error location, convert to CSV/GET params, and format SQL/XML/YAML

### User Story 4: JSON Tools

- [ ] T041 [US4] Create JSON format function in src/tools/developer/json.ts with indent options
- [ ] T042 [US4] Create JSON validate function in src/tools/developer/json.ts with error position/line/column detection
- [ ] T043 [US4] Create JSON to CSV conversion in src/tools/developer/json.ts for array of objects
- [ ] T044 [US4] Create JSON to GET params conversion in src/tools/developer/json.ts for query string format
- [ ] T045 [US4] Create JSON escape/unescape functions in src/tools/developer/json.ts
- [ ] T046 [US4] Add JSON tool handlers in ui.tsx switch statement for json-format, json-validate, json-to-csv
- [ ] T047 [US4] Add search results in src/index.ts for json: triggers

### User Story 5: Code Formatting

- [ ] T048 [US5] Create SQL formatter in src/tools/developer/sql.ts using sql-formatter library
- [ ] T049 [US5] Create YAML formatter in src/tools/developer/yaml.ts (basic indentation)
- [ ] T050 [US5] Create XML formatter in src/tools/developer/xml.ts (basic indentation)
- [ ] T051 [US5] Add code formatting handlers in ui.tsx switch statement for sql-format, yaml-format, xml-format
- [ ] T052 [US5] Add unit tests in tests/unit/developer/ for JSON and code formatting functions

## Phase 6: [US6] Regex Testing + [US7] Time Tools

**Goal**: Implement regex tester with match highlighting and timestamp converter

**Independent Test Criteria**: User can test regex patterns with highlighting, see groups, and preview replacements. User can convert timestamp to date and vice versa with timezone support

### User Story 6: Regular Expression Testing

- [ ] T053 [US6] Create regex test functions in src/tools/developer/regex.ts for pattern matching
- [ ] T054 [US6] Implement match highlighting with group extraction in regex.ts
- [ ] T055 [US6] Create regex replace preview function in src/tools/developer/regex.ts
- [ ] T056 [US6] Add regex flags UI (g, i, m) in ui.tsx for pattern configuration
- [ ] T057 [US6] Implement match result display with syntax highlighting in ui.tsx
- [ ] T058 [US6] Add search results in src/index.ts for regex:, re: triggers

### User Story 7: Timestamp and Time Tools

- [ ] T059 [US7] Enhance timestamp converter in src/tools/time/timestamp.ts for bidirectional conversion
- [ ] T060 [US7] Add timezone support in src/tools/time/timestamp.ts with offset calculation
- [ ] T061 [US7] Add milliseconds/seconds detection in timestamp.ts for auto-format
- [ ] T062 [US7] Add time tool handlers in ui.tsx switch statement for ts-to-date, date-to-ts
- [ ] T063 [US7] Add search results in src/index.ts for ts:, time: triggers

## Phase 7: [US8] QR/Barcode + [US9] Pinyin

**Goal**: Implement QR code generation/parsing, barcode generation, and Chinese pinyin conversion

**Independent Test Criteria**: User can generate QR codes from text, parse QR from image upload, generate barcodes, and convert Chinese to pinyin with tones/initials

### User Story 8: QR Code and Barcode

- [ ] T064 [US8] Create QR code generator in src/tools/generate/qrcode.ts using qrcode library
- [ ] T065 [US8] Add error correction level options in src/tools/generate/qrcode.ts (L, M, Q, H)
- [ ] T066 [US8] Create QR code parser in src/tools/generate/qrcode.ts using @zxing/library for image upload
- [ ] T067 [US8] Create barcode generator in src/tools/generate/barcode.ts using JsBarcode for CODE128, EAN formats
- [ ] T068 [US8] Add QR/barcode UI with canvas display in ui.tsx
- [ ] T069 [US8] Add file upload component for QR parsing in ui.tsx
- [ ] T070 [US8] Add search results in src/index.ts for qr:, barcode: triggers

### User Story 9: Chinese Pinyin Conversion

- [ ] T071 [US9] Create pinyin converter in src/tools/convert/pinyin.ts using pinyin-pro library
- [ ] T072 [US9] Add tone type options (symbol, none, number) in src/tools/convert/pinyin.ts
- [ ] T073 [US9] Add output type options (full, initials, array) in src/tools/convert/pinyin.ts
- [ ] T074 [US9] Add custom separator option in src/tools/convert/pinyin.ts
- [ ] T075 [US9] Add simplified/traditional Chinese conversion in src/tools/convert/s2t.ts using OpenCC dictionary
- [ ] T076 [US9] Add pinyin tool handlers in ui.tsx switch statement
- [ ] T077 [US9] Add search results in src/index.ts for pinyin:, s2t, t2s triggers
- [ ] T078 [US9] Add unit tests in tests/unit/convert/ for pinyin and s2t functions

## Phase 8: [US10] Offline Support + Polish

**Goal**: Verify offline functionality, improve error handling, add loading states, copy to clipboard, keyboard shortcuts

**Independent Test Criteria**: All tools work without network, errors show clear messages, loading states display, copy button works, keyboard shortcuts function

### User Story 10: Offline Support

- [x] T079 [US10] Verify all tools use bundled libraries only (no CDN) in package.json
- [x] T080 [US10] Add offline indicator UI in ui.tsx for network status
- [x] T081 [US10] Add error handling for online-only features with clear messages in ui.tsx

### Polish Tasks

- [x] T082 Add loading states with spinners for all async operations in ui.tsx
- [x] T083 [P] Add copy to clipboard button for all result outputs in OutputArea.tsx
- [x] T084 [P] Implement keyboard shortcuts (1-9 for categories, Enter for execute) in ui.tsx
- [x] T085 [P] Add recent tools history in localStorage with quick access UI in ui.tsx

## Implementation Strategy

### MVP First (User Story 1 + Foundation)

Complete Phase 1-3 to deliver core functionality:
- Tool navigation and selection
- Encoding tools (Base64, URL, Unicode, Hex)
- Hash tools (MD5, SHA-1, SHA-256)

### Incremental Delivery

| Increment | Contents | User Stories |
|-----------|----------|--------------|
| v1.0 | Foundation + Encoding + Basic Hash | US1, US2, US3 (partial) |
| v1.1 | Full Cryptography + JSON Tools | US3 (complete), US4 |
| v1.2 | Code Formatting + Regex + Time | US5, US6, US7 |
| v1.3 | QR/Barcode + Pinyin | US8, US9 |
| v1.4 | Polish + Offline Verification | US10 |

## File Path Summary

| Category | Path Pattern |
|----------|--------------|
| Tool Functions | `src/tools/{category}/{tool}.ts` |
| UI Components | `src/components/{Component}.tsx` |
| Hooks | `src/hooks/{hook}.ts` |
| Utils | `src/utils/{util}.ts` |
| Main Plugin | `src/index.ts`, `src/ui.tsx` |
| Types | `src/types.ts` |
| Unit Tests | `tests/unit/{category}/` |
