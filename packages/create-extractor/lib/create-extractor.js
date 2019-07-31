'use strict'

module.exports = createExtractor

/**
 * crate extracting method that
 * @param extractor {(string) => Extracted[]}
 * @return {Function}
 */
function createExtractor(extractor) {
  if (typeof extractor !== 'function') {
    throw new TypeError('expect `extractor` as function, but ' + typeof extractor)
  }
  return function(text, options = {}) {
    const { filename } = options
    const extractedList = extractor(text, options) || []
    const list = new ExtractedList(extractedList, { filename })

    return list
  }
}

/**
 * @typedef {{}}
 * @name Extracted
 * @property namespace {string}
 * @property data {any}
 * @property code {string}
 */
class Extracted {
  constructor(data) {
    Object.assign(this, data)
  }
  toString() {
    return [this.namespace ? `// @namespace ${this.namespace}` : '', this.code].filter(Boolean).join('\n')
  }
}

class ExtractedList extends Array {
  constructor(items = [], { filename } = {}) {
    if (Array.isArray(items)) {
      super()
      this.push(...items)
      this.filename = filename
    } else {
      super(...arguments)
    }
  }

  push(...items) {
    items = items.map(item => new Extracted(item))
    return super.push(...items)
  }

  toString() {
    return this.map(extracted => {
      return String(extracted)
    }).join('\n')
  }
}
