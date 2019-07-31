/**
 * @file extractor
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/31
 *
 */

const createExtractor = require('create-extractor')
const parseJavascript = require('./parse-javascript')

function createUniqueId(name) {
  let i = -1
  return () => {
    i++
    if (i === 0) {
      return name
    }
    return name + '_' + i
  }
}

module.exports = createExtractor((text, { filename, accesses = null } = {}) => {
  const list = []

  const ast = parseJavascript(
    {
      source: text,
      file: filename,
      sortKey: ''
    },
    {
      documentExported: false
    }
  )

  const examplesList = ast
    .filter(item => {
      if (!accesses) {
        return true
      }

      return accesses.includes(item.access)
    })
    .map(item => {
      return {
        examples: item.examples || [],
        name: item.name
      }
    })

  examplesList.forEach(item => {
    const name = item.name
    const getName = name && createUniqueId(name)

    item.examples.forEach(example => {
      if (example.description) {
        list.push({
          namespace: getName && getName(),
          code: example.description,
          data: {
            name: item.name
          }
        })
      }
    })
  })

  console.log(JSON.stringify(list, null, 2))

  return list
})
