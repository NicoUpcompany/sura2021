const express = require("express");
const TimeController = require("../controllers/time");

const api = express.Router();

api.get("/time", TimeController.getTime);

module.exports = api;