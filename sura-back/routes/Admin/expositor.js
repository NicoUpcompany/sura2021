const express = require("express");
const multiParty = require("connect-multiparty");
const ExpositorController = require("../../controllers/Admin/expositor");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/expositor" });

const api = express.Router();

api.get("/expositor/:talk", [md_auth.ensureAuth], ExpositorController.getExpositor);
api.get("/expositor", [md_auth.ensureAuth], ExpositorController.getAllExpositor);
api.post("/expositor", [md_auth.ensureAuth], ExpositorController.saveExpositor);
api.put(
	"/expositor/:id",
	[md_auth.ensureAuth],
	ExpositorController.updateExpositor
);
api.delete(
	"/expositor/:id",
	[md_auth.ensureAuth],
	ExpositorController.deleteExpositor
);
api.get("/expositor-image/:image", ExpositorController.getImage);
api.put(
	"/expositor-image/:id",
	[md_upload_avatar],
	ExpositorController.uploadImage
);

module.exports = api;
