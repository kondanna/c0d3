const allFuns = {}

function mergeArrays(arr1, arr2) {
    return [...arr1, ...arr2]
}

function firstLongerThan(arr, num) {
    return arr.find(e => e.length > num)
}

function getReturnValues(arr) {
    return arr.map(e => e())
}

function zeroSquare(num, i=0, rows=[], result=[]) {
    if (i == num) return result 
    rows.push(0)
    result.push(rows)
    return zeroSquare(num, i+1, rows, result)
}

const addKV = (obj, k, v) => {
    obj[k] = v
}

const filterNonKeys = (arr, obj) => arr.filter(e => obj[e])

const addDescriptions = (arr, obj) => {
    arr.forEach(e => {
        e['description'] = obj[e['name']]
    })
}

const countOccurrences = arr => arr.reduce((acc, e) => { 
    !acc[e] ? acc[e] = 1 : acc[e]++
    return acc
}, {})

const longestString = obj => Object.values(obj).reduce((acc, e) => e.length > acc.length ? e : acc, '')

const keyOfLongestString = obj => Object.keys(obj).reduce((acc, e) => obj[e].length > obj[acc].length ? e : acc, Object.keys(obj)[0])

const removeLongestString = obj => { delete obj[keyOfLongestString(obj)] }

Object.prototype.forEach = function(cb) { 
    Object.entries(this).forEach((e, i) => {
        cb(e[0], e[1], i)
    })
}

Object.prototype.filter = function(cb, result={}) {
    Object.entries(this).forEach(e => {
        if (cb(e[0], e[1])) result[e[0]] = e[1]
    })
    return result
}

Object.prototype.reduce = function(cb, result={}) {
    return Object.entries(this).reduce((acc, e, i) => cb(acc, e[0], e[1], i), result)
}


Array.prototype.getCharCount = function(result={}) {
    this.forEach(e => {
        [...e].forEach(char => {
            result[char] = (result[char] || 0) + 1
        })
    })
    return result
}

Array.prototype.getMostCommon = function(groupedElements=[]) {
    const arrMapCommon = this.reduce((acc, e) => {
        const map = acc[0]
        map[e] = (map[e] || 0) + 1
        if (map[e] > acc[2]) {
            acc[1] = e
            acc[2] = map[e]
        }
        return acc
    }, [{}, undefined, 0])
    return arrMapCommon[1] || null
}

allFuns.mergeArrays = mergeArrays
allFuns.firstLongerThan = firstLongerThan
allFuns.getReturnValues = getReturnValues
allFuns.zeroSquare = zeroSquare
allFuns.addKV = addKV
allFuns.filterNonKeys = filterNonKeys
allFuns.addDescriptions = addDescriptions
allFuns.countOccurrences = countOccurrences
allFuns.longestString = longestString
allFuns.keyOfLongestString = keyOfLongestString
allFuns.removeLongestString = removeLongestString

module.exports = allFuns