const allFuns = {}

allFuns.sumAll = (arr) => arr.length === 0 ? 0 : arr.reduce((acc, e) => acc + e) 

module.exports = allFuns