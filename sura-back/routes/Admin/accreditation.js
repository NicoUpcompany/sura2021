const express = require("express");
const AccreditationControlle = require("../../controllers/Admin/accreditation");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/accreditation", AccreditationControlle.getAccreditation);
api.post(
	"/accreditation",
	[md_auth.ensureAuth],
	AccreditationControlle.saveAccreditation
);
api.put(
	"/accreditation/:id",
	[md_auth.ensureAuth],
	AccreditationControlle.updateAccreditation
);

module.exports = api;
