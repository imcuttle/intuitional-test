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
// unknown message 0
add(1, 1) // => 2
// unknown message 0
add(1, 2);
// => 3
// unknown message 0
1+2; // => 3
// unknown message 0
[{abc: 'abc' + 'x'}];
/* => [
  {abc: 'abc'}
 ]
 */

// aaa
1+2 // => 3

      `,
        {
          presets: [[require.resolve('..'), { stringifyOptions: { a: '2' } }]]
        }
      ).code
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

const add = (a, b) => a + b; // unknown message 0


_looseEqual(add(1, 1), 2, \\"unknown message 0\\"); // => 2
// unknown message 0


_looseEqual(add(1, 2), 3, \\"unknown message 0\\"); // => 3
// unknown message 0


_looseEqual(1 + 2, 3, \\"unknown message 0\\"); // => 3
// unknown message 0


_looseEqual([{
  abc: 'abc' + 'x'
}], [{
  abc: 'abc'
}], \\"unknown message 0\\");
/* => [
  {abc: 'abc'}
 ]
 */
// aaa


_looseEqual(1 + 2, 3, \\"aaa\\"); // => 3"
`)
  })

  it('spec like jest', () => {
    expect(
      babel.transform(
        `const add = (a, b) => a + b;
// unknown message 0
add(1, 1) // != 1
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
                  looseNotEqual: 'not.toEqual',
                  looseEqual: 'toEqual',
                  strictEqual: 'toBe',
                  strictNotEqual: 'not.toBe'
                },
                expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)'
              }
            ]
          ]
        }
      ).code
    ).toMatchInlineSnapshot(`
"const add = (a, b) => a + b; // unknown message 0


it(\\"unknown message 0\\", function () {
  return expect(add(1, 1)).not.toEqual(1);
}); // != 1
// add test

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
          filename: 'root/fake.js',
          presets: ['@babel/react', require.resolve('..')]
        }
      ).code
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

import React from 'react'; // react test

_looseEqual(React.createElement(\\"div\\", null, \\"123\\"), React.createElement(\\"div\\", null, \\"123\\"), \\"react test\\"); // => <div>123</div>"
`)
  })

  it('spec in async', () => {
    expect(
      babel.transform(
        `
const delayReturn = result => new Promise(resolve => {
  setTimeout(resolve, 1000, result)
});
// unknown message 0
delayReturn(4) // => Promise<4>`,
        {
          filename: 'fake.js',
          presets: [require.resolve('..')]
        }
      ).code
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

const delayReturn = result => new Promise(resolve => {
  setTimeout(resolve, 1000, result);
}); // unknown message 0


Promise.resolve(delayReturn(4)).then(function (_actual_) {
  _looseEqual(_actual_, 4, \\"unknown message 0\\");
}.bind(this)); // => Promise<4>"
`)
  })
})
