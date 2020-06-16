/**
 * Write a function called solution that
 *   takes in 2 parameters, a number and a function,
 *   runs the input function input number of times
 * @param {number} num
 * @param {function} fun
 * @returns null
 */

const solution = (num, fun) => {
  if (num <= 0) {
    return
  }
  fun()
  num -= 1
  return solution(num, fun)
}

module.exports = {
  solution
}
