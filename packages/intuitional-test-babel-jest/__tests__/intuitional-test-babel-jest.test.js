'use strict'

const { process } = require('..')

const sourceString = `
const sum = (a, b) => a + b;

// message
sum(1, 2); // => Promise<3>
`

const mockConfig = {
  moduleFileExtensions: []
}

function stripeSourceMap(text) {
  return text.replace(/^\/\/# sourceMappingURL=[^]+?$/m, '')
}

const sum = (a, b) => a + b

describe('intuitional-test-babel-jest', () => {
  it('spec', () => {
    const result = process(sourceString, 'dummy_path.js', mockConfig)
    expect(stripeSourceMap(result.code)).toMatchInlineSnapshot(`
"const sum = (a, b) => a + b;

it(\\"message\\", function () {
  return Promise.resolve(sum(1, 2)).then(function (_actual_) {
    expect(_actual_).toEqual(3);
  }.bind(this));
}.bind(this));
"
`)
  })

  it('spec md', () => {
    const result = process(
      `
~~~javascript
${sourceString}
~~~
`,
      'dummy_path.md',
      mockConfig
    )
    expect(stripeSourceMap(result.code)).toMatchInlineSnapshot(`
"describe(\\"dummy_path.md_1\\", function () {
  ;

  (function () {
    const sum = (a, b) => a + b;

    it(\\"message\\", function () {
      return Promise.resolve(sum(1, 2)).then(function (_actual_) {
        expect(_actual_).toEqual(3);
      }.bind(this));
    }.bind(this));
  })();
}.bind(this));
"
`)
  })

  it('spec jsdoc', function() {
    const result = process(
      `
/**
 * @name sum
 * @param a
 * @param b
 * @return {*}
 * @example
 * // sum-test
 * sum(1, 34) // => 35
 */
const sum = (a, b) => a + b
`,
      'dummy_path.js',
      mockConfig
    )
    expect(stripeSourceMap(result.code)).toMatchInlineSnapshot(`
"const sum = (a, b) => a + b;

describe(\\"name\\", function () {
  ;

  (function () {
    it(\\"sum-test\\", function () {
      return expect(sum(1, 34)).toEqual(35);
    }.bind(this));
  })();
}.bind(this));
"
`)
  })
})
