const express = require("express");
const IframeController = require("../../controllers/Admin/iframe");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/iframe", [md_auth.ensureAuth], IframeController.getIframe);
api.post("/iframe", [md_auth.ensureAuth], IframeController.saveIframe);
api.put("/iframe/:id", [md_auth.ensureAuth], IframeController.updateIframe);

module.exports = api;
