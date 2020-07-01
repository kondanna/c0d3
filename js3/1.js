/**
 * given arr of strings (keys) and an object, return an array of values.
 * @param {array} arr {object} obj
 * @returns {array} arr
 */

const solution = (arr, obj) => {
  return arr.map(e => {
    if (obj[e]) return obj[e]
  })
}

module.exports = {
  solution
}
