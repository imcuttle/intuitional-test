'use strict'

module.exports = babelPresetIntuitionalTest

function babelPresetIntuitionalTest({ parseOptions, stringifyOptions, ...options } = {}) {
  // TODO

  return {
    plugins: [
      [require('babel-plugin-intuitional-test-parse'), { ...options, parseOptions }],
      [require('babel-plugin-intuitional-test-stringify'), { ...options, stringifyOptions }]
    ]
  }
}
