/**
 * @file assert
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/29
 *
 */

const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const babylon = require('babylon')
const { addDefault } = require('@babel/helper-module-imports')

// const assert = require('assert')

const assertMethodMapper = {
  strictEqual: 'strictEqual',
  looseEqual: 'deepEqual',
  looseNotEqual: 'notDeepEqual',
  strictNotEqual: 'notStrictEqual'
}

module.exports = function(ast, options) {
  let cursor = 0

  const cache = new Map()
  const addDefaultImport = (path, source, nameHint = source) => {
    // If something on the page adds a helper when the file is an ES6
    // file, we can't reused the cached helper name after things have been
    // transformed because it has almost certainly been renamed.
    const key = `${source}:${nameHint}`

    let cached = cache.get(key)
    if (cached) {
      cached = types.cloneDeep(cached)
    } else {
      cached = addDefault(path, source, {
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

  const addInteropRequireDefault = (path, source, nameHint = source) => {
    // If something on the page adds a helper when the file is an ES6
    // file, we can't reused the cached helper name after things have been
    // transformed because it has almost certainly been renamed.
    const key = `${source}:${nameHint}`

    let cached = cache.get(key)
    if (cached) {
      cached = types.cloneDeep(cached)
    } else {
      cached = addDefault(path, source, {
        importedInterop: 'uncompiled',
        nameHint
      })

      cache.set(key, cached)
    }
    return cached
  }

  traverse(ast, {
    // ReferencedIdentifier(path) {
    //   let importName = this.importName
    //   if (importName) {
    //     importName = types.cloneDeep(importName)
    //   } else {
    //     // require('bluebird').coroutine
    //     importName = this.importName = addDefault(path, '', 'bluebird')
    //   }
    //
    //   path.replaceWith(importName)
    // },
    ExpressionStatement(path) {
      if (path.node.data) {
        const { type, rawValue, description } = path.node.data

        const method = assertMethodMapper[type]
        if (method) {
          Object.assign(path.node, {
            expression: types.callExpression(
              addDefaultImport(path, 'assert'),
              // types.identifier('assert')
              [
                path.node.expression,
                babylon.parseExpression(rawValue),
                types.stringLiteral(description || 'unknown message ' + cursor++)
              ]
            )
          })
        }
      }
    }
  })

  return generate(ast, options).code
}
