const express = require("express");
const QuestionController = require("../controllers/question");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/question", [md_auth.ensureAuth], QuestionController.makeQuestion);
api.get("/question", [md_auth.ensureAuth], QuestionController.getQuestions);
api.get("/question/:id", [md_auth.ensureAuth], QuestionController.getUserQuestion);
api.delete("/question/:id", [md_auth.ensureAuth], QuestionController.deleteQuestion);

module.exports = api;