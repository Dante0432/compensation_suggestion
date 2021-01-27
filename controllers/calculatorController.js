const catchAsync = require("../utils/catchAsync");
const axios = require('axios');
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

const EXPERIENCE = "1-plus-year";
function arrToFilter(arr, length){
    arr.sort((acc,el)=>el.weight-acc.weight)
    arr.splice(length)
    return {"and":arr.reduce((acc,el)=> acc.concat({ term:el.name, "experience": EXPERIENCE }),[])}
}

exports.calculator = catchAsync(async (req,res,next) => {

    const bios = await axiosApi.get('/bios/'+req.params.username)
    const person = bios.data.person
    const strengths = bios.data.strengths
    const filter = arrToFilter(strengths,5)

    const params = { params:{ size:0, aggregate:true } }
    const aggregatorsPeople = axiosBrowser.post('/people/_search',filter,params);

    const aggregatorsOpportunities = axiosBrowser.post('/opportunities/_search',filter,params);
    const results = await Promise.all([aggregatorsPeople,aggregatorsOpportunities ])

    const compensationPeopleData = results[0].data.aggregators.compensationrange
    const compensationOpportunitiesData = results[1].data.aggregators.compensationrange

    const resultRegression = regression.linear([[0, 1], [32, 67], [12, 79]])

    res.status(200).json({
      status: "success",
      person,
      compensationPeopleData,
      compensationOpportunitiesData,
      resultRegression
    });
})