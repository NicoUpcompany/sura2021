const express = require("express");
const multiParty = require("connect-multiparty");
const ButtonController = require("../../controllers/Admin/button");

const md_auth = require("../../middleware/authenticated");
const md_upload_file = multiParty({ uploadDir: "./uploads/button" });

const api = express.Router();

api.get("/button/:id", [md_auth.ensureAuth], ButtonController.getButtons);
api.post("/button", [md_auth.ensureAuth], ButtonController.newButton);
api.put("/button/:id", [md_auth.ensureAuth], ButtonController.updateButton);
api.delete("/button/:id", [md_auth.ensureAuth], ButtonController.deleteButton);
api.get("/button-file/:file", ButtonController.getFile);
api.put("/button-file/:id",
	[md_auth.ensureAuth],
	[md_upload_file],
	ButtonController.uploadFile
);

module.exports = api;
