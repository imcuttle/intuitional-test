/**
 * @file jest.config.base
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/7/30
 *
 */

module.exports = {
  roots: ['<rootDir>', '<rootDir>/packages'],
  testPathIgnorePatterns: ['__template', 'packages/.+/README.md', 'packages/.+/CHANGLOG.md', 'CHANGELOG.md'],
  transform: {
    '^.+\\.jsx?$': '<rootDir>/packages/intuitional-test-babel-jest',
    '^.+\\.md$': '<rootDir>/packages/intuitional-test-babel-jest'
  },
  moduleNameMapper: {
    // '^intuitional-test$': require.resolve('.')
  },
  testRegex: '((\\.(test|spec)\\.(jsx?|md))|(\\.md))$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'md']
}
