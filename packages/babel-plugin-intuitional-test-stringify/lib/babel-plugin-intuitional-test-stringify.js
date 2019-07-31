'use strict'
const crypto = require('crypto')
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
  return {
    visitor: createVisitor(babel, opts)
  }
}

function getOptions(options) {
  return Object.assign(
    {
      libraryTarget: 'named',
      // libraryTarget: 'external',
      // wrapTemplate: 'it(MESSAGE, function() {return BODY});',
      libraryName: 'assert',
      asyncWrapTemplate: [
        '  Promise.resolve(ACTUAL).then(',
        '    function(_actual_) {',
        '      EXPRESSION',
        '    }.bind(this)',
        '  );'
      ].join('\n'),
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

  let cache
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

  let cursor
  return {
    Program: {
      enter() {
        cache = new Map()
        cursor = 0
      },
      exit() {
        cursor = null
      }
    },
    ExpressionStatement(path, { filename = '' }) {
      const { methodMapper, wrapTemplate, libraryTarget, libraryName, asyncWrapTemplate, expressionTemplate } = options
      if (path.node.data && path.node.data.intuitionalTest && !path.node.data.intuitionalTest.stringified) {
        const { type, rawValue, description, async } = path.node.data.intuitionalTest
        path.node.data.intuitionalTest.stringified = true

        const hash = crypto
          .createHash('md5')
          .update(__filename)
          .update('\0', 'utf8')
          .update(filename)
          .digest('hex')

        const method = methodMapper[type] || methodMapper['*']
        const MESSAGE = types.stringLiteral(description || 'unknown message ' + cursor++ + ' ' + hash)
        const LIBRARY_NAME = types.identifier(libraryName)
        const EXPECTED = parseExpression(rawValue)
        const ACTUAL = path.node.expression
        const METHOD = method && libraryTarget === 'named' ? addAssertRequire(path, type) : types.identifier(method)
        let EXPRESSION = async
          ? babel.template(expressionTemplate)(
              filterParams(expressionTemplate, {
                MESSAGE,
                METHOD,
                LIBRARY_NAME,
                EXPECTED,
                ACTUAL: types.identifier('_actual_')
              })
            ).expression
          : babel.template(expressionTemplate)(
              filterParams(expressionTemplate, {
                MESSAGE,
                METHOD,
                LIBRARY_NAME,
                EXPECTED,
                ACTUAL
              })
            ).expression

        const BODY = async
          ? babel.template(asyncWrapTemplate)(
              filterParams(asyncWrapTemplate, {
                EXPRESSION,
                MESSAGE,
                METHOD,
                LIBRARY_NAME,
                EXPECTED,
                ACTUAL
              })
            ).expression
          : EXPRESSION

        const bodyNode =
          wrapTemplate &&
          babel.template(wrapTemplate)(
            filterParams(wrapTemplate, {
              MESSAGE,
              METHOD,
              LIBRARY_NAME,
              EXPECTED,
              ACTUAL,
              EXPRESSION,
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
