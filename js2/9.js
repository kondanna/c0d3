/**
 * Replicate Array.prototype.reduce and call it cReduce
 * Documentation:
 *     Replicate Array.prototype.reduce and call it cReduce
 */

const solution = () => {
  Array.prototype.cReduce = function (cb, acc=0, i=0) {
    if (i == this.length) return acc
    return this.cReduce(cb, cb(acc, this[i], i, this), i+1)
  }
}

module.exports = {
  solution
}
