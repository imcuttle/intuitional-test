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
"var _assert = require(\\"assert\\");

const add = (a, b) => a + b;

_assert(add(1, 1), 2, \\"unknown message 0\\"); // => 2


_assert(add(1, 2), 3, \\"unknown message 1\\"); // => 3


_assert(1 + 2, 3, \\"unknown message 2\\"); // => 3"
`)
  })
})
