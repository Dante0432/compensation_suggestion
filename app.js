
const express = require("express");

/****Security****/
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
const morgan = require("morgan")

/****Routes to import****/
const calculatorRouter = require("./routes/calculatorRouter");

const app = express();

/****Middlewares****/
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(xss());
app.use(hpp());
app.use(function(req, res, next) {
  res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
  );
  next();
});
app.use(morgan('dev'))

/****Routes to use****/
app.use("/api/v1/calculator", calculatorRouter);

module.exports = app;
