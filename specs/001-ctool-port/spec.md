# Feature Specification: Ctool Developer Toolkit Port

**Feature Branch**: `001-ctool-port`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "移植https://github.com/baiy/ctool的全部功能"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Encrypt/Decrypt Data (Priority: P1)

As a developer, I need to quickly encrypt or decrypt data using various algorithms (AES, DES, RSA, SM2, SM4, etc.) to test encryption implementations or secure sensitive data during development.

**Why this priority**: Encryption/decryption is one of the most frequently used developer tools, essential for security testing and data protection workflows.

**Independent Test**: Can be fully tested by inputting plaintext, selecting an algorithm and key, and verifying the encrypted output can be decrypted back to the original.

**Acceptance Scenarios**:

1. **Given** a user has plaintext data, **When** they select AES encryption with a key and IV, **Then** the system produces valid encrypted output that can be decrypted.
2. **Given** a user has encrypted data, **When** they provide the correct key and algorithm settings, **Then** the system decrypts and displays the original plaintext.
3. **Given** a user selects RSA encryption, **When** they provide a public key, **Then** the system encrypts data that can only be decrypted with the corresponding private key.

---

### User Story 2 - Hash Generation and Verification (Priority: P1)

As a developer, I need to generate hash values (MD5, SHA-1, SHA-256, SHA-512, SM3, etc.) for files or text to verify data integrity or generate checksums.

**Why this priority**: Hash generation is fundamental for file verification, password handling, and data integrity checks in development workflows.

**Independent Test**: Can be fully tested by inputting text or uploading a file and verifying the generated hash matches expected values from known test vectors.

**Acceptance Scenarios**:

1. **Given** a user inputs text, **When** they select SHA-256 algorithm, **Then** the system displays the correct hash value.
2. **Given** a user uploads a file, **When** they request MD5 hash, **Then** the system calculates and displays the file's hash.
3. **Given** a user has a hash value, **When** they use bcrypt verification with the original password, **Then** the system confirms whether they match.

---

### User Story 3 - Encode/Decode Data (Priority: P1)

As a developer, I need to encode and decode data in various formats (Base64, URL encoding, Unicode, HTML entities, Gzip, Punycode) for data transformation tasks.

**Why this priority**: Encoding/decoding operations are essential daily tasks for web developers handling data transmission and storage.

**Independent Test**: Can be fully tested by encoding data and verifying the decoded result matches the original input.

**Acceptance Scenarios**:

1. **Given** a user has binary data, **When** they select Base64 encoding, **Then** the system produces valid Base64 output.
2. **Given** a user has a URL with special characters, **When** they apply URL encoding, **Then** all special characters are properly escaped.
3. **Given** a user has HTML content, **When** they encode HTML entities, **Then** special characters are converted to their entity equivalents.

---

### User Story 4 - JSON Processing (Priority: P1)

As a developer, I need to format, validate, minify, and transform JSON data to work with API responses and configuration files.

**Why this priority**: JSON is the most common data format in modern development; processing tools are used constantly.

**Independent Test**: Can be fully tested by inputting malformed JSON and verifying formatting/validation results.

**Acceptance Scenarios**:

1. **Given** a user has minified JSON, **When** they request formatting, **Then** the system displays properly indented, readable JSON.
2. **Given** a user has invalid JSON, **When** they attempt to format it, **Then** the system displays clear error messages indicating the problem location.
3. **Given** a user has JSON data, **When** they query with JSONPath, **Then** the system returns the matching data elements.

---

### User Story 5 - Code Formatting (Priority: P2)

As a developer, I need to format code in various languages (JavaScript, TypeScript, HTML, CSS, SQL, XML, YAML, etc.) to improve readability and maintain consistency.

**Why this priority**: Code formatting improves code quality and is frequently needed when working with minified or poorly formatted code.

**Independent Test**: Can be fully tested by inputting unformatted code and verifying the output follows standard formatting conventions.

**Acceptance Scenarios**:

1. **Given** a user has minified JavaScript, **When** they request formatting, **Then** the system produces properly indented, readable code.
2. **Given** a user has SQL query, **When** they format it, **Then** keywords are properly capitalized and clauses are on separate lines.
3. **Given** a user has XML content, **When** they format it, **Then** elements are properly nested and indented.

---

### User Story 6 - QR Code and Barcode Generation/Parsing (Priority: P2)

As a developer, I need to generate QR codes and barcodes from text/URLs, and parse existing codes to extract their content.

**Why this priority**: QR codes are widely used in mobile applications and marketing; generation/parsing tools are frequently needed.

**Independent Test**: Can be fully tested by generating a QR code and scanning it back to verify the content matches.

**Acceptance Scenarios**:

1. **Given** a user inputs a URL, **When** they generate a QR code, **Then** the system displays a scannable QR code image.
2. **Given** a user uploads a QR code image, **When** they parse it, **Then** the system extracts and displays the encoded content.
3. **Given** a user inputs product data, **When** they generate a barcode, **Then** the system produces a valid barcode in the selected format.

---

### User Story 7 - Time and Timestamp Conversion (Priority: P2)

As a developer, I need to convert between timestamps and human-readable dates, work with different timezones, and calculate time differences.

**Why this priority**: Timestamp handling is essential for debugging logs, API development, and working with time-sensitive data.

**Independent Test**: Can be fully tested by converting a known timestamp and verifying the date output matches expected values.

**Acceptance Scenarios**:

1. **Given** a user inputs a Unix timestamp, **When** they convert it, **Then** the system displays the corresponding date/time in multiple formats.
2. **Given** a user selects two timezones, **When** they input a time, **Then** the system shows the equivalent time in both zones.
3. **Given** a user inputs two dates, **When** they calculate the difference, **Then** the system displays the duration in various units.

---

### User Story 8 - UUID Generation (Priority: P2)

As a developer, I need to generate UUIDs in various versions (v1, v4, etc.) for creating unique identifiers in applications.

**Why this priority**: UUID generation is commonly needed for database records, session IDs, and distributed systems.

**Independent Test**: Can be fully tested by generating multiple UUIDs and verifying they are unique and properly formatted.

**Acceptance Scenarios**:

1. **Given** a user requests UUID v4, **When** they generate, **Then** the system produces a valid random UUID.
2. **Given** a user needs multiple UUIDs, **When** they specify a count, **Then** the system generates the requested number of unique UUIDs.
3. **Given** a user has a UUID, **When** they parse it, **Then** the system displays version and variant information.

---

### User Story 9 - Regular Expression Testing (Priority: P2)

As a developer, I need to test and debug regular expressions with real-time matching feedback and reference documentation.

**Why this priority**: Regex testing is essential for form validation, data parsing, and text processing tasks.

**Independent Test**: Can be fully tested by inputting a regex pattern and test string, verifying matches are highlighted correctly.

**Acceptance Scenarios**:

1. **Given** a user inputs a regex pattern and test string, **When** they test, **Then** the system highlights all matches in real-time.
2. **Given** a user's regex has capture groups, **When** matches are found, **Then** the system displays each group's captured content.
3. **Given** a user needs regex help, **When** they access the reference, **Then** the system displays common patterns and syntax documentation.

---

### User Story 10 - Text Diff Comparison (Priority: P2)

As a developer, I need to compare two text blocks and see the differences highlighted to identify changes between versions.

**Why this priority**: Diff comparison is essential for code review, debugging, and version comparison tasks.

**Independent Test**: Can be fully tested by inputting two text blocks with known differences and verifying all changes are highlighted.

**Acceptance Scenarios**:

1. **Given** a user inputs two text blocks, **When** they compare, **Then** the system displays a side-by-side diff with highlighted changes.
2. **Given** texts have additions and deletions, **When** compared, **Then** additions are shown in green and deletions in red.
3. **Given** a user wants inline view, **When** they switch modes, **Then** the system shows unified diff format.

---

### User Story 11 - IP Address Tools (Priority: P3)

As a developer, I need to look up IP address information and perform IP subnet calculations for network configuration tasks.

**Why this priority**: IP tools are useful for network debugging and configuration but less frequently used than core development tools.

**Independent Test**: Can be fully tested by inputting a known IP address and verifying the returned information is accurate.

**Acceptance Scenarios**:

1. **Given** a user inputs an IP address, **When** they look it up, **Then** the system displays geolocation and ISP information.
2. **Given** a user inputs a CIDR notation, **When** they calculate, **Then** the system displays network range, broadcast address, and available hosts.
3. **Given** a user needs IPv6 calculation, **When** they input an IPv6 address with prefix, **Then** the system displays the correct subnet information.

---

### User Story 12 - Random String Generation (Priority: P3)

As a developer, I need to generate random strings with configurable length and character sets for passwords, tokens, and test data.

**Why this priority**: Random string generation is useful for security and testing but is a simpler utility function.

**Independent Test**: Can be fully tested by generating strings with specific requirements and verifying they meet the criteria.

**Acceptance Scenarios**:

1. **Given** a user specifies length and character types, **When** they generate, **Then** the system produces a random string matching the criteria.
2. **Given** a user needs multiple strings, **When** they specify count, **Then** the system generates the requested number of unique strings.
3. **Given** a user excludes ambiguous characters, **When** generated, **Then** the output contains no similar-looking characters (0/O, 1/l).

---

### User Story 13 - Unit Conversion (Priority: P3)

As a developer, I need to convert between different units of measurement (data size, length, weight, temperature, etc.) for calculations and documentation.

**Why this priority**: Unit conversion is a helpful utility but less central to core development tasks.

**Independent Test**: Can be fully tested by converting known values and verifying results match expected conversions.

**Acceptance Scenarios**:

1. **Given** a user inputs a value in bytes, **When** they convert, **Then** the system displays equivalent values in KB, MB, GB, TB.
2. **Given** a user inputs temperature in Celsius, **When** they convert, **Then** the system shows Fahrenheit and Kelvin equivalents.
3. **Given** a user inputs length in meters, **When** they convert, **Then** the system displays feet, inches, and other units.

---

### User Story 14 - Color Conversion (Priority: P3)

As a developer, I need to convert colors between different formats (HEX, RGB, HSL, etc.) for CSS and design work.

**Why this priority**: Color conversion is useful for frontend development but is a specialized utility.

**Independent Test**: Can be fully tested by inputting a color in one format and verifying conversions to other formats are accurate.

**Acceptance Scenarios**:

1. **Given** a user inputs a HEX color, **When** they convert, **Then** the system displays RGB, HSL, and other format equivalents.
2. **Given** a user adjusts color values, **When** they modify sliders, **Then** all format values update in real-time.
3. **Given** a user picks a color visually, **When** they select from the picker, **Then** all format values are populated.

---

### User Story 15 - WebSocket Testing (Priority: P3)

As a developer, I need to connect to WebSocket servers and send/receive messages for API testing and debugging.

**Why this priority**: WebSocket testing is essential for real-time application development but is a specialized tool.

**Independent Test**: Can be fully tested by connecting to a known WebSocket echo server and verifying message round-trip.

**Acceptance Scenarios**:

1. **Given** a user inputs a WebSocket URL, **When** they connect, **Then** the system establishes a connection and shows status.
2. **Given** a connection is established, **When** the user sends a message, **Then** the system displays sent and received messages in a log.
3. **Given** the server sends messages, **When** received, **Then** the system displays them with timestamps.

---

### User Story 16 - Crontab Expression Tools (Priority: P3)

As a developer, I need to parse crontab expressions to understand schedules and generate expressions from human-readable inputs.

**Why this priority**: Crontab tools are useful for DevOps tasks but are specialized utilities.

**Independent Test**: Can be fully tested by inputting a cron expression and verifying the next execution times are correct.

**Acceptance Scenarios**:

1. **Given** a user inputs a cron expression, **When** they parse it, **Then** the system displays human-readable description and next execution times.
2. **Given** a user wants to create a schedule, **When** they use the visual builder, **Then** the system generates the correct cron expression.
3. **Given** an invalid cron expression, **When** parsed, **Then** the system displays clear error messages.

---

### User Story 17 - JWT Decode/Encode (Priority: P2)

As a developer, I need to decode JWT tokens to inspect their contents and encode payloads into JWT format for testing.

**Why this priority**: JWT handling is essential for authentication system development and debugging.

**Independent Test**: Can be fully tested by decoding a known JWT and verifying header, payload, and signature components.

**Acceptance Scenarios**:

1. **Given** a user inputs a JWT token, **When** they decode, **Then** the system displays header, payload, and signature separately.
2. **Given** a decoded JWT, **When** the user views it, **Then** expiration time and other claims are clearly displayed.
3. **Given** a user has payload data, **When** they encode with a secret, **Then** the system generates a valid JWT.

---

### User Story 18 - Variable Name Conversion (Priority: P3)

As a developer, I need to convert variable names between different naming conventions (camelCase, snake_case, PascalCase, kebab-case).

**Why this priority**: Naming convention conversion is helpful for code consistency but is a simpler utility.

**Independent Test**: Can be fully tested by inputting a variable name and verifying all convention outputs are correct.

**Acceptance Scenarios**:

1. **Given** a user inputs a camelCase name, **When** they convert, **Then** the system displays snake_case, PascalCase, and kebab-case equivalents.
2. **Given** a user inputs multiple names, **When** they convert, **Then** all names are converted simultaneously.
3. **Given** a name with numbers, **When** converted, **Then** numbers are handled appropriately in each convention.

---

### User Story 19 - Chinese Pinyin Conversion (Priority: P3)

As a developer working with Chinese text, I need to convert Chinese characters to Pinyin for sorting, searching, or display purposes.

**Why this priority**: Pinyin conversion is specialized for Chinese language applications.

**Independent Test**: Can be fully tested by inputting Chinese characters and verifying Pinyin output matches expected values.

**Acceptance Scenarios**:

1. **Given** a user inputs Chinese text, **When** they convert, **Then** the system displays Pinyin with tone marks.
2. **Given** a user prefers numbered tones, **When** they select that option, **Then** tones are shown as numbers (1-4).
3. **Given** text with polyphones, **When** converted, **Then** the system handles common readings appropriately.

---

### User Story 20 - HTTP Code Snippet Generation (Priority: P3)

As a developer, I need to convert HTTP requests (from cURL or HAR format) into code snippets in various programming languages.

**Why this priority**: HTTP snippet generation helps with API integration but is a specialized utility.

**Independent Test**: Can be fully tested by inputting a cURL command and verifying generated code is syntactically correct.

**Acceptance Scenarios**:

1. **Given** a user inputs a cURL command, **When** they convert, **Then** the system generates equivalent code in selected languages.
2. **Given** a user selects Python, **When** generated, **Then** the code uses the requests library with proper syntax.
3. **Given** a request has headers and body, **When** converted, **Then** all components are included in the generated code.

---

### Edge Cases

- What happens when input data is empty or contains only whitespace?
- How does the system handle extremely large inputs (files > 10MB, text > 1 million characters)?
- What happens when encryption/decryption fails due to incorrect key or corrupted data?
- How does the system handle invalid encoding sequences (malformed UTF-8, invalid Base64)?
- What happens when network requests fail (IP lookup, WebSocket connection)?
- How does the system handle browser-specific limitations (clipboard access, file system access)?

## Requirements *(mandatory)*

### Functional Requirements

#### Core Infrastructure
- **FR-001**: System MUST provide a unified interface to access all developer tools from a single application
- **FR-002**: System MUST support both light and dark display themes
- **FR-003**: System MUST support internationalization with at least Chinese and English languages
- **FR-004**: System MUST persist user preferences and recent tool history locally
- **FR-005**: System MUST provide quick search/filter functionality to find tools by name or category

#### Encryption Tools
- **FR-010**: System MUST support symmetric encryption algorithms: AES, DES, 3DES, RC4, Rabbit, SM4
- **FR-011**: System MUST support asymmetric encryption algorithms: RSA, SM2
- **FR-012**: System MUST support SM2 digital signature creation and verification
- **FR-013**: System MUST allow configuration of encryption parameters (mode, padding, key format, IV)
- **FR-014**: System MUST support bcrypt password hashing and verification

#### Hash Tools
- **FR-020**: System MUST support hash algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512, SM3
- **FR-021**: System MUST support HMAC generation with configurable algorithms
- **FR-022**: System MUST support file hashing via file upload
- **FR-023**: System MUST support digital signature verification

#### Encoding/Decoding Tools
- **FR-030**: System MUST support Base64 encoding/decoding for text and files
- **FR-031**: System MUST support URL encoding/decoding
- **FR-032**: System MUST support Unicode encoding/decoding (various escape formats)
- **FR-033**: System MUST support HTML entity encoding/decoding
- **FR-034**: System MUST support Gzip compression/decompression
- **FR-035**: System MUST support Punycode encoding/decoding for internationalized domain names
- **FR-036**: System MUST support Hex string to/from text conversion
- **FR-037**: System MUST support ASN.1 decoding

#### Data Format Tools
- **FR-040**: System MUST support JSON formatting, validation, minification, and JSONPath queries
- **FR-041**: System MUST support JSON Schema generation from JSON data
- **FR-042**: System MUST support JSON to code object conversion (multiple languages)
- **FR-043**: System MUST support code formatting for: JavaScript, TypeScript, HTML, CSS, LESS, SCSS, SQL, XML, YAML, PHP, Java, Vue, GraphQL, Markdown
- **FR-044**: System MUST support serialized data parsing (PHP serialize format)
- **FR-045**: System MUST support Docker Compose YAML validation and formatting

#### Generation Tools
- **FR-050**: System MUST support QR code generation with customizable size and colors
- **FR-051**: System MUST support QR code parsing from uploaded images
- **FR-052**: System MUST support barcode generation in multiple formats
- **FR-053**: System MUST support UUID generation (v1, v4) with batch generation
- **FR-054**: System MUST support random string generation with configurable character sets
- **FR-055**: System MUST support SQL parameter filling for prepared statements

#### Conversion Tools
- **FR-060**: System MUST support timestamp to date conversion and vice versa
- **FR-061**: System MUST support timezone conversion between any two timezones
- **FR-062**: System MUST support date/time arithmetic calculations
- **FR-063**: System MUST support number base conversion (binary, octal, decimal, hexadecimal, custom)
- **FR-064**: System MUST support unit conversion (data size, length, weight, temperature, etc.)
- **FR-065**: System MUST support color format conversion (HEX, RGB, HSL, CMYK)
- **FR-066**: System MUST support variable naming convention conversion
- **FR-067**: System MUST support Chinese to Pinyin conversion
- **FR-068**: System MUST support Chinese number conversion (Arabic to Chinese numerals)
- **FR-069**: System MUST support ASCII code reference and conversion
- **FR-070**: System MUST support binary data visualization and conversion
- **FR-071**: System MUST support URL parsing and component extraction
- **FR-072**: System MUST support HTTP request to code snippet conversion (cURL to various languages)

#### Validation/Check Tools
- **FR-080**: System MUST support regular expression testing with real-time matching
- **FR-081**: System MUST provide regex syntax reference documentation
- **FR-082**: System MUST support text diff comparison with visual highlighting
- **FR-083**: System MUST support crontab expression parsing and generation
- **FR-084**: System MUST support data validation checksums (BCC, CRC, LRC)

#### Network Tools
- **FR-090**: System MUST support IP address geolocation lookup
- **FR-091**: System MUST support IPv4 subnet calculation
- **FR-092**: System MUST support IPv6 subnet calculation
- **FR-093**: System MUST support WebSocket client for testing connections
- **FR-094**: System MUST support JWT token decoding and encoding

#### Text Tools
- **FR-100**: System MUST support text statistics (character count, word count, line count)
- **FR-101**: System MUST support text case conversion (upper, lower, title, sentence)
- **FR-102**: System MUST support text sorting and deduplication
- **FR-103**: System MUST support code execution/preview for supported languages

### Key Entities

- **Tool**: Represents a single developer utility with name, category, features, and configuration
- **Category**: Groups related tools (Encryption, Conversion, Encoding/Decoding, Check, Generate, Other)
- **Feature**: A specific function within a tool (e.g., "encrypt" and "decrypt" within AES tool)
- **User Preference**: Stores theme, language, favorite tools, and tool-specific settings
- **History Entry**: Records recent tool usage with input/output for quick recall

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access any tool within 3 clicks or via search in under 5 seconds
- **SC-002**: All encoding/decoding operations complete in under 1 second for inputs up to 1MB
- **SC-003**: Hash generation completes in under 2 seconds for files up to 10MB
- **SC-004**: System supports all 40+ tools from the original ctool project
- **SC-005**: 95% of tool operations work offline without network connectivity
- **SC-006**: Users can switch between Chinese and English interfaces instantly
- **SC-007**: Tool history persists across sessions, storing at least the last 50 operations per tool
- **SC-008**: QR code generation produces scannable codes at sizes from 100x100 to 1000x1000 pixels
- **SC-009**: Code formatting handles files up to 500KB without performance degradation
- **SC-010**: All cryptographic operations produce output compatible with standard implementations

## Assumptions

- Users have modern browsers supporting ES2020+ features
- File operations are limited by browser security sandbox (no direct filesystem access)
- Network-dependent features (IP lookup) require internet connectivity
- Cryptographic operations use established libraries (crypto-js, sm-crypto) for security
- Large file processing may be limited by browser memory constraints
- WebSocket testing requires accessible WebSocket servers (user-provided URLs)
