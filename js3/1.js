/**
 * given arr of strings (keys) and an object, return an array of values.
 * @param {array} arr {object} obj
 * @returns {array} arr
 */

const solution = (arr, obj, result=[]) => {
  arr.forEach(e => {
    if (obj[e]) result.push(obj[e])
  })
  return result
}
module.exports = {
  solution
}
