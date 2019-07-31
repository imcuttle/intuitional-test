'use strict'

const extractor = require('../lib/extractor')

describe('intuitional-test-md extractor', () => {
  it('spec', () => {
    expect(
      extractor(
        `
# hahahaha

\`inline code\`

~~~javascript ns=lalalala
1 + 3 // => 4
~~~
~~~typescript
1 + 5 // => 5
~~~
`,
        { languages: ['javascript', 'typescript'] }
      )
    ).toMatchInlineSnapshot(`
ExtractedList [
  Extracted {
    "code": "1 + 3 // => 4",
    "data": Object {
      "lang": "javascript",
      "meta": Object {
        "ns": "lalalala",
      },
    },
    "namespace": "lalalala",
  },
  Extracted {
    "code": "1 + 5 // => 5",
    "data": Object {
      "lang": "typescript",
      "meta": Object {},
    },
    "namespace": undefined,
  },
]
`)
  })
})
