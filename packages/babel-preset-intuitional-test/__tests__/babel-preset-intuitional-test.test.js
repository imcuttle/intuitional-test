'use strict'

const babel = require('@babel/core')

const babelPresetIntuitionalTest = require('..')

const add = (a, b) => a + b

// add test
add(1, 4) // => 5

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
          presets: [[require.resolve('..'), { stringifyOptions: { a: '2' } }]]
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

  it('spec like jest', () => {
    expect(
      babel.transform(
        `const add = (a, b) => a + b;
// add test
add(1, 1) // => 2`,
        {
          presets: [
            [
              require.resolve('..'),
              {
                libraryTarget: 'external',
                wrapTemplate: 'it(MESSAGE, function() {return BODY});',
                libraryName: 'expect',
                methodMapper: {
                  looseEqual: 'toEqual'
                },
                // expressionTemplate: 'METHOD(ACTUAL, EXPECTED, MESSAGE);',
                expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)'
              }
            ]
          ]
        }
      ).code
    ).toMatchInlineSnapshot(`
"const add = (a, b) => a + b; // add test


it(\\"add test\\", function () {
  return expect(add(1, 1)).toEqual(2);
}); // => 2"
`)
  })

  it('spec in react', () => {
    expect(
      babel.transform(
        `import React from 'react';
// react test
<div>123</div> // => <div>123</div>`,
        {
          presets: ['@babel/react', require.resolve('..')]
        }
      ).code
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

import React from 'react'; // react test

_looseEqual(React.createElement(\\"div\\", null, \\"123\\"), React.createElement(\\"div\\", null, \\"123\\"), \\"react test\\"); // => <div>123</div>"
`)
  })
})
