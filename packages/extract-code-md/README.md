# `extract-code-md`

> Extract code from markdown block code.

## Usage

```javascript
const extract = require('extract-code-md')

const list = extract(
  `
# head1

Works
~~~javascript
1 + 2 // => 3
~~~

DO NOT works
~~~typescript
1 + 2 // => 3
~~~
`,
  {
    languages: ['js', 'javascript']
  }
)

list.length // => 1
```

## Options

### `languages`

the allowed languages for extracting.

- Type: `string[]`
- Default: `['js', 'javascript']`
