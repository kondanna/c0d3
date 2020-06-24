const fn = require('./preflight.js')
const { selectiveZero } = require('./preflight.js')

describe('less3Diff function', () => {
    it('should return false on strings with >= 3 letters different', () => {
        const result = fn.less3Diff('spiderman', 'mary jane')
        expect(result).toEqual(false)
    })
    it('should return true if < 3 letters different', () => {
        const result = fn.less3Diff('spiderman', 'spyderman') 
        expect(result).toEqual(true)
    })
    it('should always return true on strings < 3 characters', () => {
        const result = fn.less3Diff('jk', 'dm')
        expect(result).toEqual(true)
    })
})

describe('reverso function', () => {
    it('should return a new string with the input string reversed', () => {
        const result = fn.reverso('sneakers')
        expect(result).toEqual('srekaens')
    })
    it('should reverse strings of one letter', () => {
        const result = fn.reverso('a')
        expect(result).toEqual('a')
    })
    it('should return an empty string with given an empty string', () => {
        const result = fn.reverso('')
        expect(result).toEqual('')
    })
})

describe('primeMachine function', () => {
    it('should return next 2 primes starting with a negative number', () => {
        const nextPrime1 = fn.primeMachine(-2)
        expect(nextPrime1()).toEqual(2)
        expect(nextPrime1()).toEqual(3)
    })
    it('should not return starting number if prime', () => {
        const nextPrime2 = fn.primeMachine(5)
        expect(nextPrime2()).toEqual(7)
        expect(nextPrime2()).toEqual(11)
    })
    it('should return next 3 primes starting at 10', () => {
        const nextPrime3 = fn.primeMachine(10)
        expect(nextPrime3()).toEqual(11)
        expect(nextPrime3()).toEqual(13)
        expect(nextPrime3()).toEqual(17)
    })
})

describe('selectiveZero function', () => {
    it('should return [] for empty arrays', () => {
        const result = fn.selectiveZero([], 3)
        expect(result).toEqual([])
    })
    it('should change multiple instances of the input  number to 0', () => {
        const testArray = [1,2,3,3,4,5]
        const result = fn.selectiveZero(testArray, 3)
        expect(result).toEqual([1,2,0,0,4,5])
    })
    it('should not modify an array with no matches', () => {
        const testArray = [1,2,3,4,5]
        const originalArray = [...testArray]
        const result = fn.selectiveZero(testArray, "I am not a match")
        expect(result).toEqual(originalArray)
    })
})

describe('largest2 function', () => {
    it('should find the largest of 3 numbers', () => {
        const result = fn.largest2([5, 3, 9])
        expect(result).toEqual(9)
    })
    it('should find the largest of 4 negative numbers', () => {
        const result = fn.largest2([-20, -2, -5, -10])
        expect(result).toEqual(-2)
    })
    it('should return undefined on an empty array', () => {
        expect(fn.largest2([])).toEqual(undefined)
    })
})

describe('firstXToZero function', () => {
    it('should change 3 numbers to 0', () => {
        const result = fn.firstXToZero([0,5,9,6], 3)
        expect(result).toEqual([0,0,0,6])
    })
    it('should not modify the array when changing 0 elements', () => {
        const result = fn.firstXToZero(["Don't", "change", "me"], 0)
        expect(result).toEqual(["Don't", "change", "me"])
    })
    it('should change all to zero when X beyond array length', () => {
        const result = fn.firstXToZero([1, 2, 3], 4)
        expect(result).toEqual([0, 0, 0])
    })
})

describe('allPrime function', () => {
    it('should return true for an array of all primes', () => {
        const result = fn.allPrime([2, 3, 17, 19])
        expect(result).toEqual(true)
    })
    it('should return false for an array with some primes', () => {
        const result = fn.allPrime([0, 7, 11, 12])
        expect(result).toEqual(false)
    })
    it('should return true for an empty array', () => {
        const result = fn.allPrime([])
        expect(result).toEqual(true)
    })
})

describe('increasing function', () => {
    it('should return true for an increasing array', () => {
        const result = fn.increasing([2, 7, 9, 10])
        expect(result).toEqual(true)
    })
    it('should return false for an array that decreases', () => {
        const result = fn.increasing([19, 13, 17, 11])
        expect(result).toEqual(false)
    })
    it('should return false if elements are repeated', () => {
        const result = fn.increasing([2, 7, 7, 10])
        expect(result).toEqual(false)
    })
    it('should return true for an array of one number', () => {
        const result = fn.increasing([51])
        expect(result).toEqual(true)
    })
})

describe('remove function', () => {
    it('should not remove anything', () => {
        const data = ["Rocket", "Groot", "Star-Lord"]
        const result = fn.removeElement(data, 'Random')
        expect(result).toEqual(["Rocket", "Groot", "Star-Lord"])
    })
    it('should remove 1 element', () => {
        const data = ["Rocket", "Groot", "Star-Lord"]
        const result = fn.removeElement(data, 'Star-Lord')
        expect(result).toEqual(["Rocket", "Groot"])
    })
    it('should remove all elements', () => {
        const data = ["Rocket", "Rocket", "Rocket"]
        const result = fn.removeElement(data, 'Rocket')
        expect(result).toEqual([])
    })
})

describe('copyWithout function', () => {
    it('should copy without 2 middle elements', () => {
        const result = fn.copyWithout([5, 2, 2, 9], 2)
        expect(result).toEqual([5, 9])
    })
    it('should not modify original array', () => {
        const arr = [5, 2, 2, 9]
        fn.copyWithout(arr, 2)
        expect(arr).toEqual([5, 2, 2, 9])
    })
    it('should copy without last 2 elements', () => {
        const result = fn.copyWithout([2, 2, 2, 3, 3], 3)
        expect(result).toEqual([2, 2, 2])
    })
    it('should return identical array if no matches', () => {
        const result = fn.copyWithout([2, 6, 4], 3)
        expect(result).toEqual([2, 6, 4])
    })
})

describe('copyReverse function', () => {
    it('should reverse copy an array of 4 elements', () => {
        const result = fn.copyReverse([1, 3, 5, 7])
        expect(result).toEqual([7, 5, 3, 1])
    })
    it('should not modify original array', () => {
        const arr = [1, 3, 5, 7]
        fn.copyReverse(arr)
        expect(arr).toEqual([1, 3, 5, 7])
    })
    it('should reverse copy an array of 1 element', () => {
        const result = fn.copyReverse(["bears"])
        expect(result).toEqual(["bears"])
    })
})

describe('copyLast function', () => {
    const heroes = ["Ironman", "Thor", "Captain", "Black Widow", "Hulk"]
    const original = [...heroes]
    it('should skip the first 2 elements', () => {
        const result = fn.copyLast(heroes, 2)
        expect(result).toEqual(["Captain", "Black Widow", "Hulk"])
    })
    it('should not modify original array', () => {
        fn.copyLast(heroes, 2)
        expect(heroes).toEqual(original)
    })
    it('should skip the first 0 elements (copy whole array)', () => {
        const result = fn.copyLast(heroes, 0)
        expect(result).toEqual(heroes)
    })
    it('should return empty array if skipping past array length', () => {
        const result = fn.copyLast(heroes, 6)
        expect(result).toEqual([])
    })
})

describe('runOnEach function', () => {
    const heroes = ["Ironman", "Thor", "Captain"]
    const thanos = () => {
        return "Thanos"
    }
    it('should call a function with two arguments', () => {
        const result = fn.runOnEach ([1,2,3,4,5], (e, i) => {
            return e + i
        })
        expect(result).toEqual([1, 3, 5, 7, 9])
    })
    it('should not modify original array', () => {
        const original = [...heroes]
        fn.runOnEach(heroes, thanos)
        expect(heroes).toEqual(original)
    })
    it('should call a function with no arguments', () => {
        const result = fn.runOnEach(heroes, thanos)
        expect(result).toEqual(["Thanos", "Thanos", "Thanos"])
    })
})

describe('onlyIndex function', () => {
    const someNumbers = [
        [1,2,3,4,5],
        [6,9,8,7,6],
        [4,5,6,6,7],
        [0,1,2,3,4]
    ]
    it('should not modify the original array', () => {
        const original = [...someNumbers]
        fn.onlyIndex(someNumbers, 2)
        expect(someNumbers).toEqual(original)
    })
    it('should pull out the element at index 2', () => {
        const result = fn.onlyIndex(someNumbers, 2)
        expect(result).toEqual([3, 8, 6, 2])
    })
    it('should pull out the element at index 0', () => {
        const result = fn.onlyIndex(someNumbers, 0)
        expect(result).toEqual([1, 6, 4, 0])
    })
})

describe('oddToZero function', () => {
    it('should zero when some elements are odd', () => {
        const result = fn.oddToZero([1, 2, 3, 4, 5])
        expect(result).toEqual([0, 2, 0, 4, 0])
    })
    it('should zero when all elements are odd', () => {
        const result = fn.oddToZero([1, 3])
        expect(result).toEqual([0, 0])
    })
    it('should return same array when no elements are odd', () => {
        const result = fn.oddToZero([8, 10, 12])
        expect(result).toEqual([8, 10, 12])
    })
})

describe('firstLetters function', () => {
    it('should grab the first letters from 5 strings', () => {
        const result = fn.firstLetters(["hello", "my", "name", "is", "pikachu"])
        expect(result).toEqual(["h", "m", "n", "i", "p"])
    })
    it('should grab the first letters from 3 strings', () => {
        const result = fn.firstLetters(["JavaScript", "is", "awesome"])
        expect(result).toEqual(["J", "i", "a"])
    })
    it('should return an empty array when given an empty array', () => {
        const result = fn.firstLetters([])
        expect(result).toEqual([])
    })
})