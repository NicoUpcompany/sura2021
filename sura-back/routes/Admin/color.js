const express = require("express");
const ColorController = require("../../controllers/Admin/color");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/colors", ColorController.getColors);
api.post("/colors", [md_auth.ensureAuth], ColorController.saveColors);
api.put("/colors/:id", [md_auth.ensureAuth], ColorController.updateColors);

module.exports = api;
