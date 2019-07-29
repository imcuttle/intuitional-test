/**
 * @file parse
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/5/16
 *
 */
const babylon = require('babylon')

module.exports = function parseToAst(source, opts) {
  return babylon.parse(source, {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    locations: false,
    plugins: [
      '*'
      // 'estree',
      // 'jsx',
      // 'flow',
      // 'doExpressions',
      // 'objectRestSpread',
      // 'decorators',
      // 'classProperties',
      // 'exportExtensions',
      // 'asyncGenerators',
      // 'functionBind',
      // 'functionSent',
      // 'dynamicImport',
      // 'templateInvalidEscapes',
      // 'classConstructorCall',
      // 'doExpressions',
    ],
    ...opts
  })
}
