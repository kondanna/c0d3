/**
 * Write a function called solution that
 *   Takes in 2 numbers and
 *   returns an array with the length equal to the first input number.
 *     Every element in the returned array is an array,
 *        with length equal to  the second input number.
 *     All values in the array is 0.
 * @param {number} row
 * @param {number} col
 * @returns {array}
 */

const solution = (row, col, cols=[], result=[]) => {
  if (row <= 0 && col <= 0) return result
  if (col > 0) cols.push(0)
  if (row > 0) result.push(cols)
  return solution(row-1, col-1, cols, result)
}

module.exports = {
  solution
}
