const lib = {}

const tokenize = (str) => {
    strArray = str.split(' ')
    return strArray.reduce((acc, e) => {
        if (e.length >= 3 && !+e) {
            acc[e.toUpperCase()] = 1
            return acc
        }
        return acc
    }, {})
}

const makeTrainingData = (obj) => {
    return Object.entries(obj).reduce((acc, e) => {
        acc.push({input: tokenize(e[0]), output: tokenize(e[1])})
        return acc
    }, [])
}

const pushAll = (obj, arr) => {
    Object.keys(obj).forEach(k => {
        obj[k].push(arr)
    })
    return obj
}

const getMostLikely = (obj) => Object.entries(obj).reduce((acc, e) => acc[1] > e[1] ? acc : e, [null, 0])[0]

lib.tokenize = tokenize
lib.makeTrainingData = makeTrainingData
lib.pushAll = pushAll
lib.getMostLikely = getMostLikely

module.exports = lib