const helpers = require('./helpers')

describe('sumAll function', () => {
    it('should add numbers in an array', () => {
        const result = helpers.sumAll([9,8,7])
        expect(result).toEqual(24)
    })
    it('should return 0 for empty arrays', () => {
        const result = helpers.sumAll([])
        expect(result).toEqual(0)
    })
    it('should concatenate strings', () => {
        const result = helpers.sumAll(['hello', 'world', 'my', 'name', 'is', 'charles'])
        expect(result).toEqual('helloworldmynameischarles')
    })
    it('should not change the original array', () => {
        const arr = [1,2,3,4]
        const result = helpers.sumAll(arr)
        expect(result).toEqual(10)
        expect(arr).toEqual([1,2,3,4])
    })
})