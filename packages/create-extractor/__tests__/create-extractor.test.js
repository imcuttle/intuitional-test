'use strict'

const intuitionalTestExtract = require('..')

describe('create-extractor', () => {
  it('spec test', () => {
    const extractor = intuitionalTestExtract((text, options) => {
      return [
        {
          namespace: 'ns',
          code: text
        }
      ]
    })

    const list = extractor('var a = 123;')
    expect(list).toMatchInlineSnapshot(`
ExtractedList [
  Extracted {
    "code": "var a = 123;",
    "namespace": "ns",
  },
]
`)

    expect(Array.isArray(list)).toBeTruthy()
    expect(list.toString()).toMatchInlineSnapshot(`
"// @namespace ns
var a = 123;"
`)
  })
})
