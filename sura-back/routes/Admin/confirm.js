const express = require("express");
const multiParty = require("connect-multiparty");
const ConfirmController = require("../../controllers/Admin/confirm");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/confirm" });

const api = express.Router();

api.get("/confirm", ConfirmController.getConfirmOptions);
api.get("/confirm-image/:image", ConfirmController.getImage);
api.post(
	"/confirm",
	[md_auth.ensureAuth],
	ConfirmController.saveConfirmOptions
);
api.put(
	"/confirm/:id",
	[md_auth.ensureAuth],
	ConfirmController.updateConfirmOptions
);
api.put("/confirm-logo/:id", [md_upload_avatar], ConfirmController.uploadLogo);
api.put(
	"/confirm-background/:id",
	[md_upload_avatar],
	ConfirmController.uploadBackground
);

module.exports = api;
