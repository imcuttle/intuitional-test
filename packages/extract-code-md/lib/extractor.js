/**
 * @file extractor
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/31
 *
 */

const createExtractor = require('create-extractor')
const unified = require('unified')
const parse = require('remark-parse')
const loaderUtils = require('loader-utils')
const visit = require('@moyuyc/visit-tree')

const remark = unified()
  .use(parse)
  .use({ settings: { position: false } })
  .freeze()

module.exports = createExtractor((text, { languages = ['js', 'javascript'] } = {}) => {
  const ast = remark.parse(text)

  const list = []
  visit(ast, node => {
    if (node.type === 'code' && languages.includes(node.lang)) {
      const parsedMeta = node.meta ? loaderUtils.parseQuery('?' + node.meta) : {}
      list.push({
        namespace: parsedMeta.namespace || parsedMeta.ns,
        code: node.value,
        data: {
          lang: node.lang,
          meta: parsedMeta
        }
      })
    }
  })
  return list
})
