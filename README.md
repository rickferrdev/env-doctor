# env-doctor

A lightweight, flexible environment variable loader and parser for TypeScript, Bun, and Node.js.

## Features

- 🚀 **Zero Dependencies**: Lightweight and fast.
- 📁 **Multiple Files**: Easily load `.env`, `.env.local`, and custom env files in sequence.
- ⚙️ **Customizable Parsing**: Change comment symbols, key-value separators, or value cleaning regex patterns.
- 🪝 **Lifecycle Hooks**: Trigger custom callbacks before and after loading files.
- 📦 **TypeScript Support**: Native TypeScript definitions included out of the box.
- 🔑 **Export Keyword Support**: Automatically strips shell `export` prefixes (e.g. `export PORT=3000`).

---

## Installation

```bash
# Using npm
npm install env-doctor

# Using bun
bun add env-doctor

# Using pnpm
pnpm add env-doctor

# Using yarn
yarn add env-doctor
```

---

## Quick Start

Create a `.env` file in your project root:

```env
PORT=3000
DATABASE_URL=postgres://localhost:5432/mydb
export API_KEY=secret_key_123 # Inline comment
```

Load it in your application:

```typescript
import config from "env-doctor";

async function main() {
  await config();

  console.log(process.env.PORT); // "3000"
  console.log(process.env.DATABASE_URL); // "postgres://localhost:5432/mydb"
  console.log(process.env.API_KEY); // "secret_key_123"
}

main();
```

---

## API Reference

### `config(options?: ConfigOptions): Promise<void>`

Asynchronously loads environment variables into `process.env`.

```typescript
import config, { ConfigOptions } from "env-doctor";

await config(options);
```

---

### `ConfigOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `path` | `string[]` | `[".env"]` | An array of file paths (relative to `process.cwd()`) to load environment variables from. |
| `customize` | `ConfigCustomizeOptions` | `undefined` | Custom syntax rules for parsing environment files. |
| `hooks` | `ConfigHooksOptions` | `undefined` | Callback functions for file loading lifecycle events. |

---

### `ConfigCustomizeOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `setSeparatorSymbol` | `string` | `"="` | Character used to separate keys from values (e.g., `:` or `=`). |
| `setCommentSymbol` | `string` | `"#"` | Character used to designate comment lines to be ignored. |
| `setRegexOfValue` | `RegExp` | `/\s+#.*$/` | Regular expression used to strip inline comments or trailing text from values. |

---

### `ConfigHooksOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `beforeLoadFile` | `(filename: string) => void` | `undefined` | Called before a file is read. Receives the full absolute file path. |
| `afterLoadFile` | `(content: string) => void` | `undefined` | Called after a file is read. Receives the unparsed raw string content of the file. |

---

## Examples

### Loading Multiple Environment Files

Files are loaded in order. Subsequent files will overwrite existing `process.env` keys if duplicated.

```typescript
import config from "env-doctor";

await config({
  path: [".env", ".env.local"],
});
```

### Custom Separator and Comment Symbol

Parsing files with custom formats (e.g., YAML-like syntax or custom comment indicators):

```typescript
import config from "env-doctor";

await config({
  customize: {
    setSeparatorSymbol: ":",
    setCommentSymbol: "//",
  },
});
```

### Using Lifecycle Hooks

Track or log environment loading progress:

```typescript
import config from "env-doctor";

await config({
  hooks: {
    beforeLoadFile: (filePath) => {
      console.log(`Loading env file: ${filePath}`);
    },
    afterLoadFile: (content) => {
      console.log(`Loaded content length: ${content.length} characters`);
    },
  },
});
```

---

## License & Author

Created by [Henrick Ferreira Saraiva](https://github.com/rickferrdev).

Licensed under the [MIT License](LICENSE).
