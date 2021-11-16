const express = require("express");
const TalkController = require("../../controllers/Admin/talk");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/talk", [md_auth.ensureAuth], TalkController.getAllTalks);
api.get("/talk/:agenda", [md_auth.ensureAuth], TalkController.getTalks);
// api.post("/talk", [md_auth.ensureAuth], TalkController.saveTalk);
api.put("/talk/:id", [md_auth.ensureAuth], TalkController.updateTalk);
api.delete("/talk/:id", [md_auth.ensureAuth], TalkController.deleteTalk);

module.exports = api;
