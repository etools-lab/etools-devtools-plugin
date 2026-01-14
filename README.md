# @etools-plugin/devtools

Developer tools plugin for [ETools](https://github.com/etools-team/etools) - A collection of useful developer utilities with a modern UI that follows etools design system.

## Features

- **JSON Formatter**: Format and validate JSON data
- **Base64 Encoder/Decoder**: Encode and decode Base64 strings
- **URL Encoder/Decoder**: Encode and decode URL components
- **Hash Generator**: Generate MD5, SHA-1, and SHA-256 hashes
- **Timestamp Converter**: Convert Unix timestamps to readable dates
- **UUID Generator**: Generate random UUID v4
- **Interactive UI**: Visual interface using etools design system (local plugin only)

## Installation

This plugin is available in the [ETools Plugin Marketplace](https://github.com/etools-team/marketplace).

1. Open ETools
2. Go to Settings → Plugins
3. Search for "Developer Tools"
4. Click Install

## Usage

### Command Line Interface

#### JSON Formatter

```
json: {"name":"test","value":123}
```

#### Base64 Encode

```
base64: Hello World
```

#### Base64 Decode

```
base64: SGVsbG8gV29ybGQ=
```

#### URL Encode

```
url: hello world
```

#### Hash Generator

```
hash:md5 mytext
hash:sha1 mytext
hash:sha256 mytext
```

#### Timestamp Converter

```
ts: 1704067200
```

#### UUID Generator

```
uuid:
```

### Interactive UI

When installed as a local plugin, this plugin provides a visual interface:

```
ui:
```

The UI features:
- Tool selection grid with icons and descriptions
- Real-time input/output display
- Visual feedback with badges and status indicators
- Quick action buttons for common use cases
- Consistent design using etools design tokens

## UI Design

The plugin UI follows etools design system guidelines:

### Design Tokens
- Uses etools color system for consistency
- Implements proper spacing and typography scales
- Follows border radius and shadow standards
- Responsive layout with proper transitions

### Components
- Built with etools UI components (`PluginUIContainer`, `Button`, `Input`, `Card`, `Badge`)
- Proper state management and error handling
- Accessible keyboard navigation
- Loading states and visual feedback

### Styling
- CSS Modules for component isolation
- Design token variables for theming
- Support for light and dark modes
- Smooth animations and transitions

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Build without UI
npm run build

# Build with UI
npm run build:ui

# Watch mode (without UI)
npm run dev

# Watch mode (with UI)
npm run dev:ui
```

### Project Structure

```
etools-devtools-plugin/
├── src/
│   ├── index.ts       # Main plugin logic
│   ├── ui.tsx         # React UI component
│   ├── ui.css         # Component styles
│   └── types.ts       # Type definitions
├── dist/              # Build output
├── package.json
├── tsconfig.json
└── README.md
```

### UI Development

The UI component uses:
- React 18+ for component rendering
- etools plugin-sdk for UI components
- CSS Modules + Design Tokens for styling
- TypeScript for type safety

When building with UI support:
1. Ensure React is installed as a peer dependency
2. Use `npm run build:ui` to include UI components
3. The `getUIComponent()` function allows dynamic loading

### Building for Distribution

```bash
# Build without UI (NPM package)
npm run build
# Output: dist/index.mjs, dist/index.d.mts

# Build with UI (local plugin)
npm run build:ui
# Output: Includes dist/ui.mjs, dist/ui.d.mts
```

## Design Guidelines

When contributing to this plugin:

1. **Follow etools Design System**
   - Use design tokens from `design-tokens.css`
   - Match spacing, typography, and color scales
   - Maintain consistent component styling

2. **Component Usage**
   - Prefer etools UI components over custom ones
   - Use `PluginUIContainer` for consistency
   - Follow component variant patterns

3. **Accessibility**
   - Ensure keyboard navigation works
   - Provide proper ARIA labels
   - Maintain focus management

4. **Performance**
   - Lazy load UI components
   - Use React.memo where appropriate
   - Optimize re-renders

## License

MIT © ETools Team

## Support

- GitHub Issues: [https://github.com/etools-team/devtools-plugin/issues](https://github.com/etools-team/devtools-plugin/issues)
- Documentation: [https://github.com/etools-team/etools](https://github.com/etools-team/etools)
- UI Guidelines: See `etools/example-plugins/ui-consistency-demo/`
