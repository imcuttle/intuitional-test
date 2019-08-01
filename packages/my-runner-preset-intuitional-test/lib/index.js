const createTransformer = require('../../my-runner-transformer-intuitional-test/lib/index')
const readPkgUp = require('read-pkg-up')
const nps = require('path')

module.exports = index

function index({
  intuitionalTest: {
    jsdoc = true,
    md = true,
    mdExtensions = ['.md', '.markdown', '.MD'],
    ...intuitionalTestRestOptions
  } = {},
  ...options
} = {}) {
  const pureMdExtensions = mdExtensions.map(ext => ext.replace(/^\./, ''))
  const mdTest = new RegExp(`\\.(${pureMdExtensions.join('|')})$`)

  const defaultCommonItOptions = {
    namespaceWrapTemplate: '',
    presetOptions: {
      libraryTarget: 'named',
      wrapTemplate: '',
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
      expressionTemplate: 'METHOD(ACTUAL, EXPECTED, MESSAGE)',
      // expressionTemplate: 'LIBRARY_NAME(ACTUAL).METHOD(EXPECTED)',
      methodMapper: {
        strictEqual: 'strictEqual',
        looseEqual: 'deepEqual',
        looseNotEqual: 'notDeepEqual',
        strictNotEqual: 'notStrictEqual'
      }
    }
  }

  const jsProcess = createTransformer({
    ...options,
    intuitionalTest: {
      ...defaultCommonItOptions,
      ...intuitionalTestRestOptions,
      jsdoc,
      md: false
    }
  })
  const result = {
    moduleNameMapper: {},
    moduleFileExtensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.node'].concat(mdExtensions || []),
    transform: {
      '.\\.jsx?$': jsProcess
    }
  }
  if (mdTest && md) {
    result.transform[mdTest.source] = createTransformer({
      ...options,
      intuitionalTest: {
        ...defaultCommonItOptions,
        ...intuitionalTestRestOptions,
        jsdoc,
        md,
        mdTest
      }
    })
  }

  const findResult = readPkgUp.sync({
    cwd: options.cwd,
    normalize: false
  })
  if (findResult && findResult.package) {
    result.moduleNameMapper[`^${findResult.package.name}$`] = nps.dirname(findResult.path)
  }

  return result
}
