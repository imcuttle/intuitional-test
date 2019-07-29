'use strict'

const intuitionalTest = require('..')

describe('intuitional-test', () => {
  it('spec test', () => {
    expect(
      intuitionalTest(`
[{abc: 'abc' + 'x'}];
/* => [
  {abc: 'abc'}
 ]
 */

1+2 // ==> 3
      `)
    ).toMatchInlineSnapshot(`
"var _strictEqual = require(\\"assert\\").strictEqual;

var _looseEqual = require(\\"assert\\").deepEqual;

_looseEqual([{
  abc: 'abc' + 'x'
}], [{
  abc: 'abc'
}], \\"unknown message 0\\");
/* => [
  {abc: 'abc'}
 ]
 */


_strictEqual(1 + 2, 3, \\"unknown message 1\\"); // ==> 3"
`)
  })
})
