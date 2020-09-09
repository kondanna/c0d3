/**
 * takes in 2 integers, create 2d array of objects. First integer represents how many nested arrays within the array. Second integer represents how many objects within each array.
 * solution(4,2)
 * returns:
 * [
    [{x: 0, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 1}, {x: 1, y: 1}],
    [{x: 0, y: 2}, {x: 1, y: 2}],
    [{x: 0, y: 3}, {x: 1, y: 3}],
  ]
 * @param {integer} num1 {integer} num2
 * @return {array} arr
 */

const make1DArray = (nElements, y, arr=[]) => {
  if (nElements === 0) return arr 
  arr.push({y, x: arr.length})
  return make1DArray(nElements-1, y, arr)
}

const solution = (numNestedArrays, numObjectsInArray, result=[]) => {
  if (numNestedArrays === 0) return result 
  result.push(make1DArray(numObjectsInArray, result.length))
  return solution(numNestedArrays-1, numObjectsInArray, result)
}

module.exports = {
  solution
}
