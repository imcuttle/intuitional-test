const babylonParser = require('./parsers/babylon')

parse.babylonParser = babylonParser
module.exports = parse

function parse(code, { parser = 'babylon', ...opts } = {}) {
  if (!!parser && typeof parser === 'string') {
    try {
      parser = require(`./parsers/${parser}`)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        parser = require(parser)
      } else {
        throw e
      }
    }
  }

  return parser(code, opts)
}
