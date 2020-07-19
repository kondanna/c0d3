/*
 * Given object of key: string values and an object of key: function values, call the functions in 2nd object, using the values in 1st object as function params
 * @param {object} obj1
 * @param {object} obj2
 * @return {object}
 **/

const solution = (obj1, obj2) => {
  return Object.keys(obj1).reduce((acc, p) => {
    acc[p] = obj1[p] // paramsList key-value pairs by default
    if (obj2[p]) {
      acc[p] = obj2[p](obj1[p]) // unless there is a key match
    } 
    return acc
  }, {})
}

module.exports = {
  solution
}
