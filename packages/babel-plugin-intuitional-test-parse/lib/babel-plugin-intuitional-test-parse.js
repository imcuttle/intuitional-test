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

function getOptions(options) {
  return Object.assign({}, options)
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

function babelPluginIntuitionalTestParse(babel, opts) {
  return { visitor: createVisitor(babel, opts) }
}

function createVisitor(babel, opts) {
  opts = getOptions(opts)

  return {
    ExpressionStatement(path) {
      const { leadingComments = [], trailingComments = [] } = path.node
      const leading = leadingComments[leadingComments.length - 1]
      const tail = trailingComments[0]
      let matched

      if (tail && (matched = matches(tail.value))) {
        if (leading && !isJSDoc(leading.value) && !matches(leading.value)) {
          matched.description = leading.value.trim()
        }
        path.node.data = Object.assign(
          path.node.data || {
            intuitionalTest: {
              ...matched,
              ...(path.node.data && path.node.data.intuitionalTest)
            }
          }
        )
      }
    }
  }
}
