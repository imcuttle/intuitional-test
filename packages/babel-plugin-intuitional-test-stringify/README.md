# `babel-plugin-intuitional-test-stringify`

> The babel plugin for intuitional test ast stringify.

## Usage

### Default Options

- Input

```javascript
// message
1 + 2 // => 3
```

- Output

```javascript
var _looseEqual = require('assert').deepEqual

_looseEqual(1 + 2, 3, message)
```

### Jest Style Options

```json
{
  "libraryTarget": "external",
  "wrapTemplate": "it(MESSAGE, function() {return BODY});",
  "libraryName": "expect",
  "methodMapper": {
    "looseNotEqual": "not.toEqual",
    "looseEqual": "toEqual",
    "strictEqual": "toBe",
    "strictNotEqual": "not.toBe"
  },
  "expressionTemplate": "LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)"
}
```

- Input

```javascript
// message
1 + 2 // => 3
```

- Output

```javascript
// message
it('message', function() {
  return expect(1 + 2).toEqual(3)
}) // => 3
```

## Options

### libraryName

The assertion library name.

- Type: `string`
- Default: `'assert'`

### `libraryTarget`

- Type: `'named' | 'external'`
- Default: `'named'`

### `expressionTemplate`

The template for generating `_looseEqual(1 + 2, 3, message);` from example.

- Type: `string`
- Default: `'METHOD(ACTUAL, EXPECTED, MESSAGE);'`

### `methodMapper`

- Type: `{ strictEqual: string, looseEqual: string, looseNotEqual: string, strictNotEqual: string }`
- Default: `{ strictEqual: 'strictEqual', looseEqual: 'deepEqual', looseNotEqual: 'notDeepEqual', strictNotEqual: 'notStrictEqual' }`
