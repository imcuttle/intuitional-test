/**
 * @file assert
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/29
 *
 */

const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const { createVisitor } = require('babel-plugin-intuitional-test-stringify')

module.exports = function(ast, options) {
  traverse(ast, createVisitor(options))

  return generate(ast, options).code
}
