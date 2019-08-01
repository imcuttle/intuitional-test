const createTransformer = require('my-runner-transformer-intuitional-test')
const readPkgUp = require('read-pkg-up')
const findUp = require('find-up')
const nps = require('path')
const fs = require('fs')
const glob = require('globby')

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

  const defaultCommonItOptions = {}

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

  const injectModuleSmartly = dir => {
    const findResult = readPkgUp.sync({
      cwd: dir,
      normalize: false
    })
    if (findResult && findResult.package) {
      result.moduleNameMapper[`^${findResult.package.name}$`] = nps.dirname(findResult.path)
    }
  }

  // Deals with lerna.json
  const path = findUp.sync('lerna.json', {
    cwd: options.cwd
  })
  if (path) {
    const lernaConfig = JSON.parse(String(fs.readFileSync(path)))
    const paths = glob.sync(lernaConfig.packages, { cwd: nps.dirname(path), onlyDirectories: true })

    paths.forEach(relativePath => {
      injectModuleSmartly(nps.join(nps.dirname(path), relativePath))
    })
  }

  injectModuleSmartly(options.cwd)

  return result
}
