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
"describe(\\"lhhh\\", function () {
  ;

  (function () {
    it(\\"lalal\\", function () {
      return expect(1 + 3).toEqual(4);
    }.bind(this));
  })();
}.bind(this));
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
"describe(\\"name\\", function () {
  ;

  (function () {
    it(\\"lxs\\", function () {
      return expect(1 + 3).toEqual(4);
    }.bind(this));
  })();
}.bind(this));
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
            '**/*.js': myRunnerTransformerIntuitionalTest({
              intuitionalTest: {
                namespaceWrapTemplate: '',
                presetOptions: {
                  libraryTarget: 'named',
                  wrapTemplate: '',
                  // libraryTarget: 'external',
                  // wrapTemplate: 'it(MESSAGE, function() {return BODY});',
                  libraryName: 'assert',
                  asyncWrapTemplate: [
                    '  Promise.resolve(ACTUAL).then(',
                    '    function(_actual_) {',
                    '      EXPRESSION',
                    '    }.bind(this)',
                    '  );'
                  ].join('\n'),
                  expressionTemplate: 'METHOD(ACTUAL, EXPECTED, MESSAGE)',
                  // expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)',
                  methodMapper: {
                    strictEqual: 'strictEqual',
                    looseEqual: 'deepEqual',
                    looseNotEqual: 'notDeepEqual',
                    strictNotEqual: 'notStrictEqual'
                  }
                }
              }
            })
          }
        }
      )
    }).toThrowErrorMatchingInlineSnapshot(`"lxs"`)
  })
})
