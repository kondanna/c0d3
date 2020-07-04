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
    const entries = Object.entries(obj)
    return entries.reduce((acc, e) => {
        acc.push({input: tokenize(e[0]), output: tokenize(e[1])})
        return acc
    }, [])
}

lib.tokenize = tokenize
lib.makeTrainingData = makeTrainingData

module.exports = lib