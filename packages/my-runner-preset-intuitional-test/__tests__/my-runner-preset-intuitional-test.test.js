'use strict'
const myRunner = require('my-runner')
const myRunnerPresetIntuitionalTest = require('..')
const presetPath = require.resolve('..')

describe('my-runner-preset-intuitional-test', () => {
  it('spec md', () => {
    expect(() => {
      myRunner.run(
        `
~~~javascript
// lalla
1 + 3 // => 5
~~~
`,
        {
          preset: presetPath,
          filename: 'abc.md'
        }
      )
    }).toThrowErrorMatchingInlineSnapshot(`"lalla"`)
  })

  it('spec jsdoc', () => {
    expect(() => {
      myRunner.run(
        `
/**
 * 
 * @example
 * // bad
 * 1 + 3 // => 3
 */
`,
        {
          preset: presetPath,
          filename: 'abc.js'
        }
      )
    }).toThrowErrorMatchingInlineSnapshot(`"bad"`)
  })

  it('spec', () => {
    expect(() => {
      myRunner.run(
        `
// bad
1 + 3 // => 3
`,
        {
          preset: presetPath,
          filename: 'abcd.js'
        }
      )
    }).toThrowErrorMatchingInlineSnapshot(`"bad"`)
  })
})
