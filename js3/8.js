/*
 * Write a function that takes in an object and a number (millieseconds).
 * - You must call each function value of the object {"nVal": (k) => {...}}
 * - {"nVal": (k) => {...When this function runs, k is "nVal"...}}
 * @param {object} obj
 * @param {number} num (millieseconds)
 * @call each function value of the object, millieseconds after each other
*/

const solution = (obj, num, i=0) => {
  const objArr = Object.entries(obj)
  if (i === objArr.length) return
  objArr[i][1](objArr[i][0])
  setTimeout(() => {
    solution(obj, num, i+1)
  }, num)
}

module.exports = {
  solution
}
