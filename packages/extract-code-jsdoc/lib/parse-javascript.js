/**
 * @file parse-javascript
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/31
 *
 */
const doctrine = require('doctrine-temporary-fork')
const jsdocReg = require('jsdoc-regex')

module.exports = function({ source, file }) {
  const reg = jsdocReg()
  const list = []

  while (reg.test(source)) {
    const comment = RegExp['$&']
    const ast = doctrine.parse(comment, {
      unwrap: true
    })

    if (ast.tags) {
      ast.tags.forEach(tag => {
        if (['public', 'private', 'protected'].includes(tag.title)) {
          ast.access = tag.title
        } else if (['access', 'name'].includes(tag.title)) {
          ast[tag.title] = tag.title
        } else if (['example'].includes(tag.title)) {
          const examples = (ast['examples'] = ast['examples'] || [])
          examples.push(tag)
        }
      })
    }

    list.push(ast)
  }

  return list
}
