# eslint-plugin-no-new-date

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

ESLint plugin that disallows the use of `new Date()` to enforce timezone-aware date handling.

## Installation

```bash
npm install --save-dev eslint-plugin-no-new-date
```

## Usage

Add `no-new-date` to your `.eslintrc` plugins, then configure the rules.

```json
{
  "plugins": ["no-new-date"],
  "rules": {
    "no-new-date/no-new-date": "error"
  }
}
```

## Rules

### `no-new-date/no-new-date`

Disallows all uses of the `new Date()` constructor to prevent accidental timezone-naive date creation.

Examples of incorrect code:

```typescript
const now = new Date();
const specific = new Date('2024-01-01');
const fromArgs = new Date(2024, 0, 1);
const viaGlobal = new globalThis.Date();
const viaWindow = new window.Date();
```

Examples of correct code:

```typescript
const timestamp = Date.now();
const parsed = Date.parse('2024-01-01');
function withShadowedDate(Date: new () => object) {
  return new Date(); // not flagged — local Date shadows the global
}
```
