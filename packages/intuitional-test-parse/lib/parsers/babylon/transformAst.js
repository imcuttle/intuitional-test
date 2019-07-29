/**
 * @file parse
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/5/16
 *
 */
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const { createVisitor } = require('babel-plugin-intuitional-test-parse')

module.exports = function transformAst(ast, opts) {
  traverse(ast, createVisitor(opts))

  return ast
}
