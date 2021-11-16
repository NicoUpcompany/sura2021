const express = require("express");
const EventController = require("../controllers/event");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/event", EventController.newEvent);
api.get("/event", [md_auth.ensureAuth], EventController.getEvent);

module.exports = api;