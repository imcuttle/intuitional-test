'use strict'

function isJSDoc(text) {
  return jsdocRegex().test(text)
}

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

module.exports = babelPluginIntuitionalTestParse
module.exports.createVisitor = createVisitor

function babelPluginIntuitionalTestParse(opts) {
  return { visitor: createVisitor(opts) }
}

function createVisitor(opts) {
  return {
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
  }
}
