/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/5/16
 *
 */

const parseAst = require('./parse')
const transformAst = require('./transformAst')

function parse(code, opts) {
  let ast = parseAst(code, opts)

  return transformAst(ast, opts)
}

module.exports = parse
