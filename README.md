# @etools-plugin/devtools

Developer tools plugin for [ETools](https://github.com/etools-team/etools) - A collection of useful developer utilities.

## Features

- **JSON Formatter**: Format and validate JSON data
- **Base64 Encoder/Decoder**: Encode and decode Base64 strings
- **URL Encoder/Decoder**: Encode and decode URL components
- **Hash Generator**: Generate MD5, SHA-1, and SHA-256 hashes
- **Timestamp Converter**: Convert Unix timestamps to readable dates
- **UUID Generator**: Generate random UUID v4

## Installation

This plugin is available in the [ETools Plugin Marketplace](https://github.com/etools-team/marketplace).

1. Open ETools
2. Go to Settings → Plugins
3. Search for "Developer Tools"
4. Click Install

## Usage

### JSON Formatter

```
json: {"name":"test","value":123}
```

### Base64 Encode

```
base64: Hello World
```

### Base64 Decode

```
base64: SGVsbG8gV29ybGQ=
```

### URL Encode

```
url: hello world
```

### Hash Generator

```
hash:md5 mytext
hash:sha1 mytext
hash:sha256 mytext
```

### Timestamp Converter

```
ts: 1704067200
```

### UUID Generator

```
uuid:
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT © ETools Team

## Support

- GitHub Issues: [https://github.com/etools-team/devtools-plugin/issues](https://github.com/etools-team/devtools-plugin/issues)
- Documentation: [https://github.com/etools-team/etools](https://github.com/etools-team/etools)
