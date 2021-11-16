const express = require("express");
const multiParty = require("connect-multiparty");
const StandController = require("../../controllers/Admin/stand");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/stands" });

const api = express.Router();

api.get("/stand", [md_auth.ensureAuth], StandController.getStands);
api.post("/stand", [md_auth.ensureAuth], StandController.newStand);
api.put("/stand/:id", [md_auth.ensureAuth], StandController.updateStands);
api.delete("/stand/:id", [md_auth.ensureAuth], StandController.deleteStands);
api.get("/stand-image/:image", StandController.getImage);
api.put(
	"/stand-image/:id",
	[md_auth.ensureAuth],
	[md_upload_avatar],
	StandController.uploadImage
);

module.exports = api;
