const express = require("express");
const pollController = require("../../controllers/Admin/poll");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/poll/:id", [md_auth.ensureAuth], pollController.getPollClient);
api.get("/full-poll/:id", [md_auth.ensureAuth], pollController.getPoll);
api.get("/full-poll", [md_auth.ensureAuth], pollController.getPollAdmin);
api.get("/question-poll", [md_auth.ensureAuth], pollController.getQuestion);
api.get("/option/:id", [md_auth.ensureAuth], pollController.getOptions);
api.get("/answer", [md_auth.ensureAuth], pollController.getAnswer);
api.post("/poll", [md_auth.ensureAuth], pollController.savePollQuestion);
api.post("/option", [md_auth.ensureAuth], pollController.savePollOption);
api.post("/answer", [md_auth.ensureAuth], pollController.savePollAnswer);
api.put("/question-poll/:id", [md_auth.ensureAuth], pollController.updateQuestion);
api.put("/option/:id", [md_auth.ensureAuth], pollController.updateOption);
api.delete("/question-poll/:id", [md_auth.ensureAuth], pollController.deleteQuestion);
api.delete("/option/:id", [md_auth.ensureAuth], pollController.deleteOption);

module.exports = api;
