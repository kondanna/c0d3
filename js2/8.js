/**
 * Replicate Array.prototype.map function and call it cMap
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_map.asp
 */

const solution = () => {
  Array.prototype.cMap = function (cb, i=0, result=[]) {
    if (i == this.length) return result 
    result.push(cb(this[i], i, this))
    return this.cMap(cb, i+1, result)
  }
}

module.exports = {
  solution
}
