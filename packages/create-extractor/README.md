# `create-extractor`

> A tool for creating extractor.

## Usage

```javascript
const createExtractor = require('create-extractor')

const extractor = createExtractor((text, options) => {
  return [
    {
      namespace: options.namespace,
      code: text
    }
  ]
})

const extractedList = extractor(`# markdown`, {
  filename: '/path/to.md',
  namespace: 'ns'
})

extractedList.length // => 1
Array.isArray(extractedList) // => true
extractedList[0] // => { namespace: 'ns', code: '# markdown' }
extractedList[0].namespace = null
extractedList.fillNamespace('prefix')
extractedList[0] // => { namespace: 'prefix_1', code: '# markdown' }
```
