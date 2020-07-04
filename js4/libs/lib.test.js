const lib = require('./lib')

describe('tokenize function', () => {
    it('should tokenize strings', () => {
        const result = lib.tokenize('hello world')
        expect(result).toEqual({HELLO: 1, WORLD: 1})
    })
    it('should return {} for empty strings', () => {
        const result = lib.tokenize('')
        expect(result).toEqual({})
    })
    it('should tokenize special characters', () => {
        const result = lib.tokenize('I like (Korean)')
        expect(result).toEqual({'LIKE': 1, '(KOREAN)': 1})
    })
    it('should ignore strings shorter than 3 characters and numbers', () => {
        const result = lib.tokenize('00 12345')
        expect(result).toEqual({})
    })
})

describe('makeTrainingData function', () => {
    it('should return empty array given {}', () => {
        const result = lib.makeTrainingData({})
        expect(result).toEqual([])
    })
    it('should return a singleton array given one key-value pair', () => {
        const result = lib.makeTrainingData({'beef boneless 100': 'MEAT'})
        expect(result).toEqual([{input: {BEEF: 1, BONELESS: 1}, output: {MEAT: 1}}])
    })
    it('should handle more than one key-value pair', () => {
        const result = lib.makeTrainingData({'beef boneless 100': 'MEAT', 'pink apples': 'VEGGIE'})
        expect(result).toEqual([{input: {BEEF: 1, BONELESS: 1}, output: {MEAT: 1}}, {input: {PINK: 1, APPLES: 1}, output: {VEGGIE: 1}}])
    })
})