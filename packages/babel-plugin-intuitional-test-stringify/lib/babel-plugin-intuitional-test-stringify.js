'use strict'

const { addNamed } = require('@babel/helper-module-imports')

let babelParser
try {
  babelParser = require('@babel/parser')
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    try {
      babelParser = require('babylon')
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  } else {
    throw e
  }
}

module.exports = babelPluginIntuitionalTestStringify
module.exports.createVisitor = createVisitor

function babelPluginIntuitionalTestStringify(babel, opts) {
  return { visitor: createVisitor(babel, opts) }
}

function getOptions(options) {
  return Object.assign(
    {
      libraryTarget: 'named',
      // libraryTarget: 'external',
      // wrapTemplate: 'it(MESSAGE, function() {return BODY});',
      libraryName: 'assert',
      expressionTemplate: 'METHOD(ACTUAL, EXPECTED, MESSAGE);',
      // expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)',
      methodMapper: {
        strictEqual: 'strictEqual',
        looseEqual: 'deepEqual',
        looseNotEqual: 'notDeepEqual',
        strictNotEqual: 'notStrictEqual'
      },
      namedImportOptions: {
        importingInterop: 'uncompiled',
        importedType: 'commonjs',
        importedInterop: 'uncompiled'
      }
    },
    options
  )
}

function filterParams(expressionTemplate, params) {
  const names = Object.keys(params)

  const newParams = { ...params }
  names.forEach(name => {
    if (expressionTemplate.indexOf(name) < 0) {
      delete newParams[name]
    }
  })
  return newParams
}

function createVisitor(babel, options) {
  const types = babel.types
  options = getOptions(options)

  let cursor = 0
  const cache = new Map()
  const addAssertRequire = (path, type) => {
    // If something on the page adds a helper when the file is an ES6
    // file, we can't reused the cached helper name after things have been
    // transformed because it has almost certainly been renamed.
    const source = options.libraryName
    const nameHint = type
    const key = `${source}:${nameHint}`

    let cached = cache.get(key)
    if (cached) {
      cached = types.cloneDeep(cached)
    } else {
      cached = addNamed(path, options.methodMapper[type] || options.methodMapper['*'], source, {
        // node / babel
        ...options.namedImportOptions,
        nameHint
      })

      cache.set(key, cached)
    }
    return cached
  }

  function parseExpression(code) {
    code = `(${code})`

    const parser = babel.parse ? (code, opts) => babel.parse(code, { parserOpts: opts }) : babelParser.parse

    if (!parser) {
      console.log(types.identifier(code))
      return types.identifier(code)
    }

    const ast = parser(code, {
      sourceType: 'module',
      plugins: [
        // 'estree',
        // 'flowComments',
        'jsx',
        // 'flow',
        // 'typescript',
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        // 'pipelineOperator',
        'throwExpressions'
      ]
    })
    return ast.program.body[0].expression
  }

  return {
    ExpressionStatement(path) {
      const { methodMapper, wrapTemplate, libraryTarget, libraryName, expressionTemplate } = options
      if (path.node.data && path.node.data.intuitionalTest && !path.node.data.intuitionalTest.stringified) {
        const { type, rawValue, description } = path.node.data.intuitionalTest
        path.node.data.intuitionalTest.stringified = true

        const method = methodMapper[type] || methodMapper['*']
        const MESSAGE = types.stringLiteral(description || 'unknown message ' + cursor++)
        const LIBRARY_NAME = types.identifier(libraryName)
        const EXPECTED = parseExpression(rawValue)
        const ACTUAL = path.node.expression
        const METHOD = method && libraryTarget === 'named' ? addAssertRequire(path, type) : types.identifier(method)
        const BODY = babel.template(expressionTemplate)(
          filterParams(expressionTemplate, {
            MESSAGE,
            METHOD,
            LIBRARY_NAME,
            EXPECTED,
            ACTUAL
          })
        ).expression

        const bodyNode =
          wrapTemplate &&
          babel.template(wrapTemplate)(
            filterParams(wrapTemplate, {
              MESSAGE,
              METHOD,
              LIBRARY_NAME,
              EXPECTED,
              ACTUAL,
              BODY
            })
          )

        if (bodyNode) {
          path.skip()
          path.replaceWith(bodyNode)
          return
        }

        path.get('expression').replaceWith(BODY)
      }
    }
  }
}
