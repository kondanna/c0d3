/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
*/

const solution = (arr, i=0, map={}, result=[]) => {
  if (i === arr.length) return result 
  map[arr[i]] = (map[arr[i]] || 0) + 1
  if (map[arr[i]] === 2) result.push(arr[i])
  return solution(arr, i+1, map, result)
}

module.exports = {
  solution
}
