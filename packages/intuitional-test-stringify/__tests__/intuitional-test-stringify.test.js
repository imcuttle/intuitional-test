'use strict'
const parse = require('intuitional-test-parse')
const intuitionalTestStringify = require('..')

describe('intuitional-test-stringify', () => {
  it('spec simple', () => {
    const ast = parse(`
      const add = (a, b) => a + b;

add(1, 1) // => 2

add(1, 2);
// => 3

1+2; // => 3`)
    expect(intuitionalTestStringify(ast)).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

const add = (a, b) => a + b;

_looseEqual(add(1, 1), 2, \\"unknown message 0\\"); // => 2


_looseEqual(add(1, 2), 3, \\"unknown message 1\\"); // => 3


_looseEqual(1 + 2, 3, \\"unknown message 2\\"); // => 3"
`)
  })
})
