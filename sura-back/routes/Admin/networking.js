const express = require("express");
const NetworkingController = require("../../controllers/Admin/networking");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/networking", NetworkingController.getNetworking);
api.post("/networking", [md_auth.ensureAuth], NetworkingController.saveNetworking);
api.put("/networking/:id", [md_auth.ensureAuth], NetworkingController.updateNetworking);

module.exports = api;
