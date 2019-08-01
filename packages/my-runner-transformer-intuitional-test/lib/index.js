'use strict'
const { createTransformer } = require('intuitional-test-babel-jest')

module.exports = index

function index(options = {}) {
  options = {
    ...options,
    intuitionalTest: {
      namespaceWrapTemplate: '',
      ...options.intuitionalTest,
      presetOptions: {
        libraryTarget: 'named',
        wrapTemplate: '',
        libraryName: 'assert',
        asyncWrapTemplate: [
          '  Promise.resolve(ACTUAL).then(',
          '    function(_actual_) {',
          '      EXPRESSION',
          '    }.bind(this)',
          '  );'
        ].join('\n'),
        expressionTemplate: 'METHOD(ACTUAL, EXPECTED, MESSAGE)',
        methodMapper: {
          strictEqual: 'strictEqual',
          looseEqual: 'deepEqual',
          looseNotEqual: 'notDeepEqual',
          strictNotEqual: 'notStrictEqual'
        },
        ...(options.intuitionalTest ? options.intuitionalTest.presetOptions : {})
      }
    }
  }

  const process = createTransformer(options).process
  return (src, { filename }) => {
    const result = process(src, filename)
    if (typeof result === 'string') {
      return result
    }

    return result && result.code
  }
}
