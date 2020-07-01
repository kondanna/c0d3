const fn = require('./preflight.js')

describe('mergeArrays function', () => {
    it('should merge 2 arrays of strings', () => {
				const arr1 = ["Rattata", "Raticate"]
				const arr2 = ["Bulbasaur", "Ivysaur", "Venusaur"]
        const result = fn.mergeArrays(arr1, arr2)
        expect(result).toEqual(["Rattata", "Raticate", "Bulbasaur", "Ivysaur", "Venusaur"])
    })
    it('should merge two arrays of numbers', () => {
        const result = fn.mergeArrays([9, 3, 5], [10])
        expect(result).toEqual([9, 3, 5, 10])
    })
    it('should merge an empty array', () => {
        const result = fn.mergeArrays(["Pikachu", "Raichu"], [])
        expect(result).toEqual(["Pikachu", "Raichu"])
    })
})

describe('firstLongerThan function', () => {
    it('should find a string in the middle of an array', () => {
				const arr = ["Ekans", "Arbok", "Pikachu", "Raichu"]
        const result = fn.firstLongerThan(arr, 5)
        expect(result).toEqual("Pikachu")
    })
    it('should find a string at the end of an array', () => {
				const arr = ["Caterpie", "Metapod", "Butterfree"]
        const result = fn.firstLongerThan(arr, 9)
        expect(result).toEqual("Butterfree")
    })
    it('should find the first string longer than 0', () => {
        const result = fn.firstLongerThan(["a", "b", "c"], 0)
        expect(result).toEqual("a")
    })
    it('should return undefined', () => {
      const result = fn.firstLongerThan([], 5)
      expect(result).toEqual(undefined)
    })
})

describe('getReturnValues function', () => {
    const fn1 = () => { return 25 }
    const fn2 = () => { return true }
    const fn3 = () => { return "Pikachu" }
    const fn4 = () => { "I'm function four" }

    it('should get 3 return values of various types', () => {
        const result = fn.getReturnValues([fn1, fn2, fn3])
        expect(result).toEqual([25, true, "Pikachu"])
    })
    it('should return an empty array if no functions', () => {
        const result = fn.getReturnValues([])
        expect(result).toEqual([])
    })
    it('should return undefined for functions with no return value', () => {
        const result = fn.getReturnValues([fn4])
        expect(result).toEqual([undefined])
    })
})

describe('zeroSquare function', () => {
    it('should create a 1x1 array of zeroes', () => {
        const square1 = [[0]]
        expect(fn.zeroSquare(1)).toEqual(square1)
    })
    it('should create a 1x1 array of zeroes', () => {
        const square2 = [
            [0,0],
            [0,0]
        ]
        expect(fn.zeroSquare(2)).toEqual(square2)
    })
    it('should create a 1x1 array of zeroes', () => {
        const square3 = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
          ]
        expect(fn.zeroSquare(3)).toEqual(square3)
    })
    it('should return an empty array for 0 value', () => {
        expect(fn.zeroSquare(0)).toEqual([])
    })
})

describe('addKV function', () => {
    it('should add a key and value to an object', () => {
        const marvel = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
          }
        fn.addKV(marvel, "antman", "funny")
        expect(marvel.antman).toEqual("funny")
    })
		it('should add a key and value to an object', () => {
        const marvel = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
						antman: "funny",
          }
        fn.addKV(marvel, "wonderwoman", "smart")
        expect(marvel.wonderwoman).toEqual("smart")
    })
	  it('should add a key and value to an object', () => {
        const marvel = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
						antman: "funny",
						wonderwoman: "smart",
          }
				const b = ["leader", "honest"]
        fn.addKV(marvel, "captainamerica", ["leader", "honest"])
        expect(marvel.captainamerica).toEqual(b)
    })
})

describe('filterNonKeys function', () => {
    const avengers = ["ironman", "strange", "thor", "spiderman", "hulk"]
    const info = {
        ironman: "arrogant",
        spiderman: "naive",
        hulk: "strong",
    }
    it('should return an empty array when filtering on an empty object', () => {
        const result = fn.filterNonKeys(avengers, {})
        expect(result).toEqual([])
    })
    it('should return an empty array when starting with an empty array', () => {
        const result = fn.filterNonKeys([], info)
        expect(result).toEqual([])
    })
    it('should return an empty array if no matches are found', () => {
				const b = ["batman", "superman", "flash"]
        const result = fn.filterNonKeys(b, info)
        expect(result).toEqual([])
    })
})

describe('addDescriptions function', () => {
    it('should add 3 descriptions to corresponding names', () => {
        const characters = [{name: "ironman"},
						{name: "spiderman"}, {name:"hulk"}]
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        fn.addDescriptions(characters, info)
        expect(characters).toEqual([
            {name: "ironman", description: "arrogant"},
            {name: "spiderman", description: "naive"},
            {name:"hulk", description: "strong"}
        ])
    })
    it('should not add descriptions to objects without names', () => {
        const characters = [{tonyStark: "ironman"},
						{peterParker: "spiderman"}, {name:"hulk"}]
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        fn.addDescriptions(characters, info)
        expect(characters).toEqual([
            {tonyStark: "ironman"},
            {peterParker: "spiderman"},
            {name:"hulk", description: "strong"}
        ])
    })
    it('should ignore unmatched keys', () => {
        const characters = [{name: "ironman"},
						{name: "rocket"}, {name:"drax"}]
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        fn.addDescriptions(characters, info)
        expect(characters).toEqual([
            {name: "ironman", description: "arrogant"},
            {name: "rocket"},
            {name:"drax"}
        ])
    })
})

describe('countOccurrences function', () => {
    it('should count occurrences of strings', () => {
        const abc = ["abc", "a", "abc", "b", "abc", "a", "b", "c", "abc"]
        const result = fn.countOccurrences(abc)
        expect(result).toEqual({abc: 4, a: 2, b: 2, c: 1})
    })
    it('should count occurrences of numbers', () => {
        const nums = [0, 3, 3, 1, 0, 0, 3, 0, 0, 2]
        const result = fn.countOccurrences(nums)
        expect(result).toEqual({'0': 5, '3': 3, '1': 1, '2': 1})
    })
    it('should return an empty object for an empty array', () => {
        const result = fn.countOccurrences([])
        expect(result).toEqual({})
    })
})

describe('longestString function', () => {
    it('should find the longest string from the beginning of an object', () => {
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        expect(fn.longestString(info)).toEqual("arrogant")
    })
    it('should find the longest string from the end of an object', () => {
        const leaders = {
            vermilion: "Surge",
            cinnabar: "Blaine",
            fuchsia: "Koga",
            saffron: "Sabrina"
        }
        expect(fn.longestString(leaders)).toEqual("Sabrina")
    })
    it('should return the empty string for an empty object', () => {
        expect(fn.longestString({})).toEqual("")
    })
})

describe('keyOfLongestString function', () => {
    it('should find key of longest string in the beginning of an object', () => {
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        expect(fn.keyOfLongestString(info)).toEqual("ironman")
    })
    it('should find key of longest string at the end of an object', () => {
        const leaders = {
            vermilion: "Surge",
            cinnabar: "Blaine",
            fuchsia: "Koga",
            saffron: "Sabrina"
        }
        expect(fn.keyOfLongestString(leaders)).toEqual("saffron")
    })
    it('should return undefined (no key) for an empty object', () => {
        expect(fn.keyOfLongestString({})).toEqual(undefined)
    })
})

describe('removeLongestString function', () => {
    it('should remove the longest string in the beginning of an object', () => {
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        fn.removeLongestString(info)
        expect(info).toEqual({spiderman: "naive", hulk: "strong"})
    })
    it('should remove the longest string at the end of an object', () => {
        const leaders = {
            vermilion: "Surge",
            cinnabar: "Blaine",
            fuchsia: "Koga",
            saffron: "Sabrina"
        }
        fn.removeLongestString(leaders)
        expect(leaders).toEqual(
					{vermilion: "Surge", cinnabar: "Blaine", fuchsia: "Koga"}
				)
    })
    it('should work on an empty object', () => {
        const imEmpty = {}
        fn.removeLongestString(imEmpty)
        expect(imEmpty).toEqual({})
    })
})

describe('forEach function', () => {
    it('should run a function 3 times on 3 elements', () => {
        const fun = jest.fn()
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        info.forEach(fun)
        expect(fun).toHaveBeenCalledTimes(3)
    })
    it('should run a function 0 times on an empty object', () => {
        const fun = jest.fn()
        const imEmpty = {}
        imEmpty.forEach(fun)
        expect(fun).not.toHaveBeenCalled()
    })
    it('should let functions access object values & positions', () => {
        const vals = []
        const fun = (_k, v, i) => {
            vals.push(i+v) 
        }
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        info.forEach(fun)
        expect(vals).toEqual(["0arrogant", "1naive", "2strong"])
    })
})

describe('filter function', () => {
    const leaders = {
        vermilion: "Surge",
        cinnabar: "Blaine",
        fuchsia: "Koga",
        saffron: "Sabrina"
    }
    it('should filter based on keys', () => {
        const seven = (k) => {
            return k.length === 7
        }
        const result = leaders.filter(seven)
        expect(result).toEqual({fuchsia: "Koga", saffron: "Sabrina"})
    })
    it('should filter based on keys', () => {
        const six = (_k, v) => {
            return v.length < 6
        }
        const result = leaders.filter(six)
        expect(result).toEqual({vermilion: "Surge", fuchsia: "Koga"})
    })
    it('should return an empty object if no matches', () => {
        const celadon = (k) => {
            return k === "Celadon"
        }
        const result = leaders.filter(celadon)
        expect(result).toEqual({})
    })
})

describe('reduce function', () => {
    it('should let functions access keys, values, & positions', () => {
        const fun = (acc, key, value, i) => {
            return acc + `${key}-${i}-${value},`
        }
        const info = {
            ironman: "arrogant",
            spiderman: "naive",
            hulk: "strong",
        }
        const result = info.reduce(fun, "")
		const exp = "ironman-0-arrogant,spiderman-1-naive,hulk-2-strong,"
        expect(result).toEqual(exp)
    })
    it('should return the starting value if the object is empty', () => {
        const imEmpty = {}
        const result = imEmpty.reduce(() => {}, "I am Groot")
        expect(result).toEqual("I am Groot")
    })
})

describe('getCharCount function', () => {
    it('should count letters in an array of 3 strings', () => {
        const result = ['Charmander', 'Charmeleon', 'Charizard'].getCharCount()
        expect(result).toEqual({
            C: 3, h: 3, a: 5,
            r: 5, m: 2, n: 2,
            d: 2, e: 3, l: 1,
            o: 1, i: 1, z: 1
        })
    })
    it('should handle an empty array', () => {
        const result = [].getCharCount()
        expect(result).toEqual({})
    })
    it('should count characters in empty strings', () => {
        const result = ["Pallet", "", "Pewter", "", "Saffron"].getCharCount()
        expect(result).toEqual({
            P: 2, a: 2, l: 2,
            e: 3, t: 2, w: 1,
            r: 2, S: 1, f: 2,
            o: 1, n: 1
        })
    })
})

describe('getMostCommon function', () => {
    it('should return a number as the most common', () => {
        const result = [9,8,7,8,7,7,7].getMostCommon()
        expect(result).toEqual(7)
    })
    it('should return a string as the most common', () => {
				const arr =  ["Batman", 8,7, "Batman", "Robin"]
        const result = arr.getMostCommon()
        expect(result).toEqual("Batman")
    })
    it('should return first element if all equally common', () => {
        const types = ["grass", "poison", "fire", "flying", "water", "bug"]
        const result = types.getMostCommon()
        expect(result).toEqual("grass")
    })
    it('should return null on an empty array', () => {
        const result = [].getMostCommon()
        expect(result).toEqual(null)
    })
})
