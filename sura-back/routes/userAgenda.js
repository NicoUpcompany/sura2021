const express = require("express");
const UserAgendaController = require("../controllers/userAgenda");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.get("/user-agenda", [md_auth.ensureAuth], UserAgendaController.getUsersByAgenda);

module.exports = api;