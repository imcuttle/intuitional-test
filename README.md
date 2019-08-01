# intuitional-test

[![Build status](https://img.shields.io/travis/imcuttle/intuitional-test/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/intuitional-test)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/intuitional-test.svg?style=flat-square)](https://codecov.io/github/imcuttle/intuitional-test?branch=master)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Make testing is intuitional and convenient in comment, markdown, jsdoc @example comment and so on.

## Syntax

```javascript ns=syntax-definition
const add = (a, b) => a + b

// looseEqual
add(1, 1) // => 2

const a = {}
// strictEqual
a // ==> a

// not looseEqual
;[{}] // != {}

// not strictEqual
;[{ abc: 'abc' }]
/* !== [
   {abc: 'abc'}
 ] */

const addAsync = (a, b) => Promise.resolve(a + b)
// async resolve value
addAsync(1, 1) // => Promise<2>
```

## How it works?

intuitional-test use [`babel-preset-intuitional-test`](./packages/babel-preset-intuitional-test)

## Usage

```javascript
```

## API

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
