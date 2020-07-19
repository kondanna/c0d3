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

describe('pushAll function', () => {
    it('should return empty object given {}', () => {
        const result = lib.pushAll({}, [9, 8, 7])
        expect(result).toEqual({})
    })
    it('should push onto non-empty arrays', () => {
        const result = lib.pushAll({ blah: [['hello']]}, [9, 8, 7])
        expect(result).toEqual({ blah: [['hello'], [9, 8, 7]]})
    })
    it('should push onto existing empty arrays', () => {
        const result = lib.pushAll({ blah: []}, [9, 8, 7])
        expect(result).toEqual({ blah: [[9, 8, 7]]})
    })
    it('should push onto multiple key value pairs', () => {
        const result = lib.pushAll({ key1: [['hello']], key2: []}, [9, 8, 7])
        expect(result).toEqual({ key1: [['hello'], [9, 8, 7]], key2: [[9, 8, 7]]})
    })
})

// lib.test.js -- continued from previous answer
describe('getMostLikely', () => {
  it('should return null if {}', () => {
    const result = lib.getMostLikely({})
    expect(result).toEqual(null)
  })
  it('should return first key', () => {
    const result = lib.getMostLikely({
      meat: 0.987,
      veggie: 0.187,
      store: 0.287
    })
    expect(result).toEqual('meat')
  })
  it('should return last key', () => {
    const result = lib.getMostLikely({
      meat: 0.287,
      veggie: 0.187,
      store: 0.987
    })
    expect(result).toEqual('store')
  })
})