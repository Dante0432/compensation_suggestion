const express = require("express");
const router = express.Router();
const calculatorController = require("./../controllers/calculatorController");

router.post("/:username", calculatorController.calculator);

module.exports = router;