const express = require("express");
const StreamingController = require("../../controllers/Admin/streaming");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get(
	"/streaming",
	[md_auth.ensureAuth],
	StreamingController.getStreamingOptions
);
api.post(
	"/streaming",
	[md_auth.ensureAuth],
	StreamingController.saveStreamingOptions
);
api.put(
	"/streaming/:id",
	[md_auth.ensureAuth],
	StreamingController.updateStreamingOptions
);

module.exports = api;
