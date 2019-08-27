# `intuitional-test-babel-jest`

> Jest transformer for intuitional test and extends `babel-jest`

## Usage

- `jest.config.js`

```javascript
module.exports = {
  transform: {
    '\\.jsx?$': 'intuitional-test-babel-jest',
    '\\.md$': 'intuitional-test-babel-jest'
  },
  testRegex: '((\\.(test|spec)\\.(jsx?|md))|(\\.md))$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'md']
}
```
