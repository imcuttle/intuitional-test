/**
 * @file jest.config
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/30
 *
 */

const base = require('./jest.config.base.js')

module.exports = {
  ...base,
  name: require('./package').name,
  displayName: require('./package').name,
  // projects: ['<rootDir>/packages/*'],
  coverageDirectory: '<rootDir>/coverage/'
}
