/*
 * Given object of key: string values and an object of key: function values, call the functions in 2nd object, using the values in 1st object as function params
 * @param {object} obj1
 * @param {object} obj2
 * @return {object}
 **/

const solution = (obj1, obj2, result) => {
  let parameterList = Object.entries(obj1)
  let functionList = Object.entries(obj2)
  return parameterList.reduce((acc, p) => {
    functionList.forEach(f => {
      console.log(p[0], f[0])
      if (p[0] === f[0]) { 
        acc[p[0]] = f[1](p[1])
        return
      } else {
        acc[p[0]] = p[1]
      }
    })
    return acc
  }, {})
}
module.exports = {
  solution
}
