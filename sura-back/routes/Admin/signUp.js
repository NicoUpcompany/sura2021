const express = require("express");
const multiParty = require("connect-multiparty");
const SignUpController = require("../../controllers/Admin/signUp");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/signUp" });

const api = express.Router();

api.get("/signup", SignUpController.getSignUpOptions);
api.get("/signup-image/:image", SignUpController.getImage);
api.post("/signup", [md_auth.ensureAuth], SignUpController.saveSignUpOptions);
api.put(
	"/signup/:id",
	[md_auth.ensureAuth],
	SignUpController.updateSignUpOptions
);
api.put("/signup-image/:id", [md_upload_avatar], SignUpController.uploadImage);

module.exports = api;
