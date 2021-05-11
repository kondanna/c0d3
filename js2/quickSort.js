const quickSort = arr => {
    if (arr.length < 2) return arr 
    const [pivot, ...rest] = arr 
    const dividedArr = rest.reduce((acc, e) => {
        if (e <= pivot) acc['left'].push(e)
        else acc['right'].push(e)
        return acc
    }, {left: [], right: []})
    return [...quickSort(dividedArr['left']), pivot, ...quickSort(dividedArr['right'])]
}
