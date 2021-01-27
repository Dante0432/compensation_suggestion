const { arrToBiosFilter, arrMedian, catchAsync, calculateIntersection, numbersInString, valueToStringRange } = require("../utils/miscellany")
const axios = require('axios')
const regression = require('regression')


const axiosApi = axios.create({ baseURL: 'https://torre.bio/api'})
const axiosBrowser = axios.create(
    { 
        baseURL: 'https://search.torre.co',
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        }
    }
)

exports.calculator = catchAsync(async (req,res,next) => {

    const bios = await axiosApi.get('/bios/'+req.params.username).catch(e => { throw new Error(e.response.data.message) })

    const person = bios.data.person
    const strengths = bios.data.strengths
    const filter = arrToBiosFilter(strengths,5)

    const params = { params:{ size:0, aggregate:true } }
    const aggregatorsPeople = axiosBrowser.post('/people/_search',filter,params)

    const aggregatorsOpportunities = axiosBrowser.post('/opportunities/_search',filter,params)
    const results = await Promise.all([ aggregatorsPeople, aggregatorsOpportunities ])

    const compensationPeople = results[0].data.aggregators.compensationrange
    const compensationOpportunities = results[1].data.aggregators.compensationrange

    const regressionPeople = regression.linear(compensationPeople.reduce((acc,el) => acc.concat([[el.total,arrMedian(numbersInString(el.value))]]),[]))
    const regressionOpportunities = regression.linear(compensationOpportunities.reduce((acc,el)=> acc.concat([[el.total,arrMedian(numbersInString(el.value))]]),[]))

    const intersection = calculateIntersection(regressionPeople.equation,regressionOpportunities.equation)

    const compensationRanges = compensationPeople.reduce((acc,el)=>acc.concat(el.value),[])
    const suggestedCompensation = valueToStringRange(intersection[0],compensationRanges)

    res.status(200).json({
      status: "success",
      person,
      compensationPeople,
      compensationOpportunities,
      suggestedCompensation
    })
})