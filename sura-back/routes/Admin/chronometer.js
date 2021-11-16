const express = require("express");
const ChronometerController = require("../../controllers/Admin/chronometer");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/time", ChronometerController.getTime);
api.post("/time", [md_auth.ensureAuth], ChronometerController.saveTime);
api.put("/time/:id", [md_auth.ensureAuth], ChronometerController.updateTime);

module.exports = api;
