const allFuns = {}

function less3Diff(str1, str2, i=0, differences=0) {
    if (str1.length == i) {
        return true
    }
    if (differences > 2) {
        return false
    }
    if (str1.charAt(i) !== str2.charAt(i)) {
        differences++
    }
    return less3Diff(str1, str2, i+1, differences)
}

function reverso(str, result='', i=str.length) {
    if (i == 0) {
        return result
    }
    return reverso(str, result + str[i-1], i-1)
}

function primeMachine(num) {
    if (num < 2) {
        num = 1
    }
    if (isPrime(num)) {
        num++
    }
    return () => {
        let result = nextPrime(num)
        num = result + 1
        return result
    }
}

function isPrime(num, i=2) {
    if (num == i) return true
    if (num < i || num % i == 0) return false
    return isPrime(num, i+1)
}

function nextPrime(num) {
    // given a number, return the next prime number
    if (isPrime(num)) return num
    return nextPrime(num+1)
}

function selectiveZero(arr, num, i=0) {
    if (arr.length == i) {
        return arr
    }
    if (arr[i] == num) {
        arr[i] = 0
    }
    return selectiveZero(arr, num, i+1)
}

function largest(arr) {
    return arr.reduce((acc, i) => i > acc ? i : acc, arr[0])
}

function largest2(arr, i=0, max=arr[0]) {
    if (i == arr.length) {
        return max
    }
    if (arr[i] > max) {
        max = arr[i]
    }
    return largest2(arr, i+1, max)
}

function firstXToZero(arr, firstX, i=0) {
    if (arr.length == i || i == firstX) {
        return arr
    }
    arr[i] = 0
    return firstXToZero(arr, firstX, i+1)
}

function allPrime(arr, i=0) {
    if (arr.length == i) {
        return true
    }
    if (!isPrime(arr[i])) {
        return false
    }
    return allPrime(arr, i+1)
}

function increasing(arr, i=1) {
    if (arr.length == 0 || arr[i] <= arr[i-1]) return false
    if (i >= arr.length) return true 
    return increasing(arr, i+1)
}

function removeElement(arr, str, i=0, result=[]) {
    if (arr.length == i) return result 
    if (arr[i] !== str) result.push(arr[i])
    return removeElement(arr, str, i+1, result)
}

function copyWithout(arr, withoutX, i=0, result=[]) {
    if (arr.length == i) return result
    if (arr[i] !== withoutX) result.push(arr[i])
    return copyWithout(arr, withoutX, i+1, result)
}

function copyReverse(arr, i=0, result=[]) {
    if (arr.length == i) return result
    result.unshift(arr[i])
    return copyReverse(arr, i+1, result)
}

function copyLast(arr, exclude, i=0, result=[]) {
    if (arr.length == i) return result 
    if (i >= exclude) result.push(arr[i])
    return copyLast(arr, exclude, i+1, result)
}

function runOnEach(arr, fun, i=0, result=[]) {
    if (i >= arr.length) return result
    result.push(fun(arr[i], i))
    return runOnEach(arr, fun, i+1, result)
}   

function onlyIndex(arr, index, i=0, result=[]) {
    if (i == arr.length || index >= arr[i].length) return result 
    result.push(arr[i][index])
    return onlyIndex(arr, index, i+1, result)
}

function oddToZero(arr) {
    return arr.map((e) => { 
        if (e % 2) return 0
        return e
     })
}

function firstLetters(arr) {
    return arr.map(e => e[0])
}

Array.prototype.getEvens = function() {
    return this.filter(e => e % 2 == 0)
}

Array.prototype.sum = function() {
    return this.reduce((acc, e) => acc + e)
}

Array.prototype.fizzbuzz = function() {
    return this.forEach((elem, idx, arr) => {
        if (elem % 3 == 0) arr[idx] = "fizz"
        if (elem % 5 == 0) arr[idx] = "buzz"
        if (elem % 3 == 0 && elem % 5 == 0) arr[idx] = "fizzbuzz"
    })
}

allFuns.less3Diff = less3Diff
allFuns.reverso = reverso
allFuns.primeMachine = primeMachine
allFuns.selectiveZero = selectiveZero
allFuns.largest = largest
allFuns.largest2 = largest2
allFuns.firstXToZero = firstXToZero
allFuns.allPrime = allPrime
allFuns.increasing = increasing
allFuns.removeElement = removeElement
allFuns.copyWithout = copyWithout
allFuns.copyReverse = copyReverse
allFuns.copyLast = copyLast
allFuns.runOnEach = runOnEach
allFuns.onlyIndex = onlyIndex
allFuns.oddToZero = oddToZero
allFuns.firstLetters = firstLetters

module.exports = allFuns