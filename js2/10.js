/**
 * Replicate Array.prototype.filter and call it cFilter
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_filter.asp
 */

const solution = () => {
  Array.prototype.cFilter = function (cb, i=0, result=[]) {
    if (i == this.length) return result
    if (cb(this[i], i, this)) result.push(this[i])
    return this.cFilter(cb, i+1, result)
  }
}

module.exports = {
  solution
}
