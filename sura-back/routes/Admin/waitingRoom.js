const express = require("express");
const multiParty = require("connect-multiparty");
const WaitingRoomController = require("../../controllers/Admin/waitingRoom");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/waitingroom" });

const api = express.Router();

api.get(
	"/waitingroom",
	[md_auth.ensureAuth],
	WaitingRoomController.getWaitingRoomOptions
);
api.get("/waitingroom-image/:image", WaitingRoomController.getImage);
api.post(
	"/waitingroom",
	[md_auth.ensureAuth],
	WaitingRoomController.saveWatingRoomOptions
);
api.put(
	"/waitingroom/:id",
	[md_auth.ensureAuth],
	WaitingRoomController.updateWaitingRoomOptions
);
api.put(
	"/waitingroom-header/:id",
	[md_upload_avatar],
	WaitingRoomController.uploadHeader
);
api.put(
	"/waitingroom-logo/:id",
	[md_upload_avatar],
	WaitingRoomController.uploadLogo
);

module.exports = api;
