'use strict'

const intuitionalTestParse = require('..')

describe('intuitional-test-parse', () => {
  it('spec test', () => {
    expect(
      intuitionalTestParse(`
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

      `)
    ).toMatchSnapshot()
  })
})
