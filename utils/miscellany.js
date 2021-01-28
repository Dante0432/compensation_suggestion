const catchAsync = fn => {
    return async (req, res, next) => {
        try{
            await fn(req, res, next)
            next()
        }catch (e) {
            res.status(404).json({
              status: "error",
              error: e.message
            });
        }
    }
}

const arrToBiosFilter = (arr, length) => {
    const EXPERIENCE = "1-plus-year"
    arr.sort((acc,el)=>el.weight-acc.weight)
    arr.splice(length)
    return {"or":arr.reduce((acc,el)=> acc.concat({skill:{ term:el.name, "experience": EXPERIENCE }}),[])}
}

const numbersInString = str => {
    const regex = /(\d+)/g
    return str.match(regex)
}

const arrMedian = arr => {
    const sum = arr.reduce((acc, el) => acc = parseInt(acc) + parseInt(el));
    return Math.floor(sum / arr.length)
}

const valueToStringRange = (value,arr) => {
    let range = 'No range'
    for (const iterator of arr) {
        let limits = numbersInString(iterator)
        if(between(limits,value)){
            range = iterator
        }
    }
    return range
}

const between = ([a, b], toValidate) => {
    let min
    let max
    let response 
    if(b){
        min = Math.min.apply(Math, [parseInt(a),parseInt(b)])
        max = Math.max.apply(Math, [parseInt(a),parseInt(b)])
        response = toValidate > min && toValidate < max
    }else{
        response = a < toValidate  
    }
    return response
};


/*
* @param straightOne array line equation coefficients [a, b] 
* @param straightTwo array line equation coefficients [a, b]
* @return array [x,y] point of intersection x quantity y amount
*/
const calculateIntersection = (straightOne,straightTwo) => {
    const aOne = straightOne[0]
    const bOne = straightOne[1]
    const aTwo = straightTwo[0]
    const bTwo = straightTwo[1]
    const x = (-bOne + bTwo)/(aOne-aTwo)
    const y = aOne*x + bOne
    return [x,y] 
}

module.exports = {
    catchAsync,
    arrToBiosFilter,
    numbersInString,
    arrMedian,
    valueToStringRange,
    between,
    calculateIntersection
}