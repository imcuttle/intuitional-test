/**
 * @file parse-javascript
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/31
 *
 */
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const doctrine = require('doctrine-temporary-fork')

function isJSDocComment(comment /*: {
  value: string,
  type: string
}*/) {
  const asterisks = comment.value && comment.value.match && comment.value.match(/^(\*+)/)
  return comment.type === 'CommentBlock' && asterisks && asterisks[1].length === 1
}

module.exports = function({ source, file }, { appendPlugins, ...options } = {}) {
  const list = []

  const ast = parser.parse(source, {
    sourceFilename: file,
    sourceType: 'module',
    ...options,
    plugins: (
      options.plugins || [
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
    ).concat(appendPlugins || [])
  })

  const cached = new WeakMap()
  traverse(ast, {
    enter(path) {
      ;(path.node['leadingComments'] || [])
        .concat(path.node['trailingComments'] || [])
        .concat(path.node['innerComments'] || [])
        .forEach(comment => {
          if (cached.has(comment)) {
            return
          }
          cached.set(comment, true)

          if (isJSDocComment(comment)) {
            const parsed = doctrine.parse(comment.value, {
              unwrap: true
            })

            if (parsed.tags) {
              parsed.tags.forEach(tag => {
                if (['public', 'private', 'protected'].includes(tag.title)) {
                  parsed.access = tag.title
                } else if (['access', 'name'].includes(tag.title)) {
                  parsed[tag.title] = tag.title
                } else if (['example'].includes(tag.title)) {
                  const examples = (parsed['examples'] = parsed['examples'] || [])
                  examples.push(tag)
                }
              })
            }
            list.push(parsed)
          }
        })
    }
  })

  return list
}
