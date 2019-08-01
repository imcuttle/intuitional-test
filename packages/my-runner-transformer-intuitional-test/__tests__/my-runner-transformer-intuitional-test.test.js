'use strict'
const runner = require('my-runner')
const myRunnerTransformerIntuitionalTest = require('..')

describe('my-runner-transformer-intuitional-test', () => {
  it('test md', () => {
    const trans = myRunnerTransformerIntuitionalTest({
      sourceMaps: false
    })

    expect(
      trans(
        `
# sadsa 

~~~javascript ns=lhhh
// lalal
1 + 3 // => 4
~~~
`,
        { filename: 'a.md' }
      ).replace(/^\/\/# sourceMappingURL.*/m, '')
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

;

(function () {
  _looseEqual(1 + 3, 4, \\"lalal\\");
})();
"
`)
  })

  it('test jsdoc', () => {
    const trans = myRunnerTransformerIntuitionalTest({
      sourceMaps: false
    })

    expect(
      trans(
        `
/**
 * @name abc
 * @public
 * @example
 * // lxs
 * 1+3 // => 4
 */
`,
        { filename: 'a.js' }
      ).replace(/^\/\/# sourceMappingURL.*/m, '')
    ).toMatchInlineSnapshot(`
"var _looseEqual = require(\\"assert\\").deepEqual;

;

(function () {
  _looseEqual(1 + 3, 4, \\"lxs\\");
})();
"
`)
  })

  it('runner', () => {
    expect(() => {
      runner.run(
        `
/**
 * @name abc
 * @public
 * @example
 * // lxs
 * 1+3 // => 5
 */
`,
        {
          filename: 'fake.js',
          transform: {
            '**/*.js': myRunnerTransformerIntuitionalTest()
          }
        }
      )
    }).toThrowErrorMatchingInlineSnapshot(`"lxs"`)
  })
})
