const express = require("express");
const multiParty = require("connect-multiparty");
const SignInController = require("../../controllers/Admin/signIn");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/signIn" });

const api = express.Router();

api.get("/signin", SignInController.getSignInOptions);
api.get("/signin-image/:image", SignInController.getImage);
api.post("/signin", [md_auth.ensureAuth], SignInController.saveSignInOptions);
api.put(
	"/signin/:id",
	[md_auth.ensureAuth],
	SignInController.updateSignInOptions
);
api.put(
	"/resize-signin/:id",
	[md_auth.ensureAuth],
	SignInController.resizeSignInLogo
);
api.put("/signin-logo/:id", [md_upload_avatar], SignInController.uploadLogo);
api.put(
	"/signin-background/:id",
	[md_upload_avatar],
	SignInController.uploadBackground
);

module.exports = api;
