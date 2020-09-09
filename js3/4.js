/*
 * 2sum: write a function that takes in an array of numbers and a number, and returns true if any pairs add up to the number. (No duplicates)
 * @param {array} arr
 * @param {number} num
 * @returns {boolean}
 */

const solution = (arr, num, i=0, map={}) => {
  if (i === arr.length) return false
  if (map[num-arr[i]]) return true 
  map[arr[i]] = true
  return solution(arr, num, i+1, map)
}

/*
const solution = (arr, target, diffs={}) => {
  return arr.some(num => {
    if (diffs[target - num]) return true
    diffs[num] = true
    return false
  })
}
*/


module.exports = {
  solution
}
