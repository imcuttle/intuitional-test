/**
 * @file jest.config.base
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/30
 *
 */

module.exports = {
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['__template'],
  transform: {
    '^.+\\.jsx?$': '<rootDir>/packages/intuitional-test-babel-jest',
    '^.+\\.test\\.md$': '<rootDir>/packages/intuitional-test-babel-jest'
  },
  testRegex: '.(test|spec).(jsx?|md)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'md']
  // testMatch: ['**/__test{s,}__/*.(spec|test).{t,j}s{x,}'],
  // setupTestFrameworkScriptFile: '<rootDir>/scripts/test-setup.js'
}
