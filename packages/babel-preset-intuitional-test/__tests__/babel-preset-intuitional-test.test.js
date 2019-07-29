'use strict'

const babel = require('@babel/core')

const babelPresetIntuitionalTest = require('..')

describe('babel-preset-intuitional-test', () => {
  it('spec', () => {
    expect(
      babel.transform(
        `
      const add = (a, b) => a + b;

add(1, 1) // => 2

add(1, 2);
// => 3

1+2; // => 3

[{abc: 'abc' + 'x'}];

/* => [
  {abc: 'abc'}
 ]
 */

1+2 // => 3

      `,
        {
          presets: [require.resolve('..')]
        }
      ).code
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

const add = (a, b) => a + b;

_looseEqual(add(1, 1), 2, \\"unknown message 0\\"); // => 2


_looseEqual(add(1, 2), 3, \\"unknown message 1\\"); // => 3


_looseEqual(1 + 2, 3, \\"unknown message 2\\"); // => 3


_looseEqual([{
  abc: 'abc' + 'x'
}], [{
  abc: 'abc'
}], \\"unknown message 3\\");
/* => [
  {abc: 'abc'}
 ]
 */


_looseEqual(1 + 2, 3, \\"unknown message 4\\"); // => 3"
`)
  })
})
