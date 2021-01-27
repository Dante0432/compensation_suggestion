const catchAsync = require("../utils/catchAsync");
//const axios = require('axios');


exports.calculator = catchAsync(async (req,res,next) => {
  try{
    console.log(req.params.username)
    
    res.status(200).json({
      status: "success"
    });
  }catch (e) {
    res.status(404).json({
      status: "error",
      error: e.response
    });
  }
})