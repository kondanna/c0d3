/*
 * write a map function for objects
 * @param {callback} cb
 * @returns {number}
*/

const solution = () => {
  Object.prototype.map = function (cb) {
    return Object.entries(this).map((e, idx) => cb(e[0], e[1], idx))
  }
}

module.exports = {
  solution
}
