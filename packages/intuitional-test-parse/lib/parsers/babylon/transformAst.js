/**
 * @file parse
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/5/16
 *
 */
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const jsdocRegex = require('jsdoc-regex')

const typeMapper = {
  '==': 'strictEqual',
  '==>': 'strictEqual',
  '=>': 'looseEqual',
  '=': 'looseEqual',
  '!=': 'looseNotEqual',
  '!==': 'strictNotEqual'
}

function matches(text) {
  if (isJSDoc(text)) return

  const result = text.match(/^\s*(==>|==|=>|!=|!==|=)\s*([^]+)$/)
  if (result) {
    return {
      type: typeMapper[result[1]],
      comparison: result[1],
      rawValue: result[2]
    }
  }
}

function isJSDoc(text) {
  return jsdocRegex().test(text)
}

module.exports = function transformAst(ast, opts) {
  traverse(ast, {
    ExpressionStatement(path) {
      const { leadingComments = [], trailingComments = [] } = path.node
      const leading = leadingComments[leadingComments.length - 1]
      const tail = trailingComments[0]
      let matched

      if (tail && (matched = matches(tail.value))) {
        if (leading && !isJSDoc(leading.value) && !matches(leading.value)) {
          matched.description = leading.node.value
        }

        path.node.data = Object.assign(path.node.data || {}, matched)
      }
    }
  })

  return ast
}
