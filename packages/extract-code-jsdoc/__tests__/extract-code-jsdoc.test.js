'use strict'

const extractCodeJsdoc = require('..')

describe('extract-code-jsdoc', () => {
  it('spec test', () => {
    extractCodeJsdoc(`
const c = '123';      

/**
 * @param {number} a 
 * @param {number} b 
 * @example
 * add(1, 3) // => 4
 * @example
 * add(2, 3) // => 5
 */
const add = (a, b) => a + b

/**
 * @public
 * @name plus
 * @param {number} a 
 * @param {number} b 
 * @example
 * plus(1, 3) // => 4
 * plus(1, 3) // => 4
 * @example
 * plus(2, 3) // => 5
 */
const plus = (a, b) => a + b
`)
  })
})
