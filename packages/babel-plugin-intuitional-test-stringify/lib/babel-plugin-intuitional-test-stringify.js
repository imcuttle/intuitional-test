'use strict'

const types = require('@babel/types')
const babylon = require('babylon')
const { addNamed } = require('@babel/helper-module-imports')

module.exports = babelPluginIntuitionalTestStringify
module.exports.createVisitor = createVisitor

function babelPluginIntuitionalTestStringify(options) {
  return { visitor: createVisitor(options) }
}

function createVisitor(options) {
  options = Object.assign(
    {
      assertLibrary: 'assert',
      assertMethodMapper: {
        strictEqual: 'strictEqual',
        looseEqual: 'deepEqual',
        looseNotEqual: 'notDeepEqual',
        strictNotEqual: 'notStrictEqual'
      }
    },
    options
  )

  let cursor = 0
  const cache = new Map()
  const addAssertRequire = (path, type) => {
    // If something on the page adds a helper when the file is an ES6
    // file, we can't reused the cached helper name after things have been
    // transformed because it has almost certainly been renamed.
    const source = options.assertLibrary
    const nameHint = type
    const key = `${source}:${nameHint}`

    let cached = cache.get(key)
    if (cached) {
      cached = types.cloneDeep(cached)
    } else {
      cached = addNamed(path, options.assertMethodMapper[type], source, {
        // node / babel
        importingInterop: 'uncompiled',
        importedType: 'commonjs',
        importedInterop: 'uncompiled',
        nameHint
      })

      cache.set(key, cached)
    }
    return cached
  }

  return {
    ExpressionStatement(path) {
      if (path.node.data) {
        const { type, rawValue, description } = path.node.data

        const method = options.assertMethodMapper[type]
        if (method) {
          Object.assign(path.node, {
            expression: types.callExpression(addAssertRequire(path, type), [
              path.node.expression,
              babylon.parseExpression(rawValue),
              types.stringLiteral(description || 'unknown message ' + cursor++)
            ])
          })
        }
      }
    }
  }
}
