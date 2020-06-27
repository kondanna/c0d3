/**
 * Replicate Array.prototype.reduce and call it cReduce
 * Documentation:
 *     Replicate Array.prototype.reduce and call it cReduce
 */

const solution = () => {
  Array.prototype.cReduce = function (cb, acc, i=0) {
    if (acc == undefined) return this.cReduce(cb, this[0], 1)
    if (i == this.length) return acc
    return this.cReduce(cb, cb(acc, this[i], i, this), i+1)
  }
}

module.exports = {
  solution
}
