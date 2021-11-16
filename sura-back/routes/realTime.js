const express = require("express");
const RealTimeController = require("../controllers/realTime");

const api = express.Router();

api.post("/real-time", RealTimeController.newRealTimeData);
api.get("/real-time", RealTimeController.getRealTimeData);

module.exports = api;