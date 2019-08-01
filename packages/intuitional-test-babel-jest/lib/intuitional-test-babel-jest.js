'use strict'

const babelJest = require('babel-jest')
const extractFromJSDoc = require('extract-code-jsdoc')
const extractFromMarkdown = require('extract-code-md')

function createSourceList(extractedList, namespaceWrapTemplate) {
  const sources = []
  extractedList.forEach(extracted => {
    let template = namespaceWrapTemplate || 'BODY'
    const data = {
      NAMESPACE: JSON.stringify(extracted.namespace),
      BODY: [`;(function(){`, extracted.code, `})()`].join('\n')
    }
    Object.keys(data).forEach(name => {
      template = template.replace(name, data[name])
    })

    sources.push(template)
  })
  return sources
}

function createTransformer({
  intuitionalTest: {
    extractMarkdownOptions = {},
    extractJSDocOptions = {},
    presetOptions = {},
    namespaceWrapTemplate = [`describe(NAMESPACE, function() {`, '  BODY', `}.bind(this))`].join('\n'),
    jsdoc = true,
    md = true,
    mdTest = /\.(md|markdown)$/i
  } = {},
  ...options
} = {}) {
  options = {
    comments: false,
    ...options,
    presets: ((options && options.presets) || []).concat([
      [
        require.resolve('babel-preset-intuitional-test'),
        {
          libraryTarget: 'external',
          wrapTemplate: 'it(MESSAGE, function() {return BODY}.bind(this));',
          libraryName: 'expect',
          expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)',
          ...presetOptions,
          methodMapper: {
            looseNotEqual: 'not.toEqual',
            looseEqual: 'toEqual',
            strictEqual: 'toBe',
            strictNotEqual: 'not.toBe',
            ...presetOptions.methodMapper
          }
        }
      ]
    ])
  }
  const babelTransformer = babelJest.createTransformer(options)

  let i = 0
  return Object.assign({}, babelTransformer, {
    getCacheKey(fileData, filename = '', configString, { config = {}, instrument, rootDir }) {
      return babelTransformer.getCacheKey(fileData, filename, configString, { config, instrument, rootDir })
    },
    process(src, filename = '', config = {}, transformOptions) {
      if (md && mdTest && filename.match(mdTest)) {
        const extractedList = extractFromMarkdown(src, { ...extractMarkdownOptions, filename })
        extractedList.fillNamespace(filename)
        const sources = createSourceList(extractedList, namespaceWrapTemplate)
        src = sources.join('\n')
      }
      // Appends the jsdoc code in tail
      else if (jsdoc) {
        const extractedList = extractFromJSDoc(src, { ...extractJSDocOptions, filename })
        extractedList.fillNamespace(filename)
        src = [src, '/* --- intuitional-test-babel-jest --- */']
          .concat(createSourceList(extractedList, namespaceWrapTemplate))
          .join('\n')
      }

      return babelTransformer.process.apply(this, [src, filename, config, transformOptions])
    }
  })
}

module.exports = Object.assign(createTransformer(), {
  createTransformer
})
