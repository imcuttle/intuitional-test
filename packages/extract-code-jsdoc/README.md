# `extract-code-jsdoc`

> Extract code from jsdoc `@example` tag.

## Usage

```javascript
const extractCodeJsdoc = require('extract-code-jsdoc')

const list = extractCodeJsdoc(`
/**
 * @param {number} a
 * @param {number} b
 * @example
 * add(1, 3) // => 4
 * @example
 * add(2, 3) // => 5
 */
const add = (a, b) => a + b

/**
 * @public
 * @name plus
 * @param {number} a
 * @param {number} b
 * @example
 * plus(1, 3) // => 4
 */
const plus = (a, b) => a + b
` /*, options */)

list.length // => 3

Array.from(list)
/* => [{
   "code": "add(1, 3) // => 4",
   "data": {
     "name": undefined,
   },
   "namespace": undefined,
 }, {
    "code": "add(2, 3) // => 5",
    "data": {
      "name": undefined,
    },
    "namespace": undefined,
  }, {
     "code": "plus(1, 3) // => 4",
     "data": {
       "name": "name",
     },
     "namespace": "name",
   }]
 */
```

## Options

### `accesses`

the allowed accesses for extracting.

- Type: `string[]`
- Default: `null`
- Example: `['private', 'protected', 'public']`

```javascript
const extractCodeJsdoc = require('extract-code-jsdoc')

const list = extractCodeJsdoc(
  `
/**
 * @param {number} a
 * @param {number} b
 * @example
 * add(1, 3) // => 4
 * @example
 * add(2, 3) // => 5
 */
const add = (a, b) => a + b

/**
 * @public
 * @name plus
 * @param {number} a
 * @param {number} b
 * @example
 * plus(1, 3) // => 4
 */
const plus = (a, b) => a + b
`,
  { accesses: ['public'] }
)

list.length // => 1

Array.from(list)
/* => [{
   "code": "plus(1, 3) // => 4",
   "data": {
     "name": "name",
   },
   "namespace": "name",
 }]
 */
```
