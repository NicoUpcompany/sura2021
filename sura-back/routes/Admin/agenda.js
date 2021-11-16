const express = require("express");
const AgendaController = require("../../controllers/Admin/agenda");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.get("/admin-agenda", [md_auth.ensureAuth], AgendaController.getAgendas);
api.get("/client-agenda", [md_auth.ensureAuth], AgendaController.getAgendasClient);
api.post("/admin-agenda", [md_auth.ensureAuth], AgendaController.saveAgenda);
api.put("/admin-agenda/:id", [md_auth.ensureAuth], AgendaController.updateAgenda);
api.delete("/admin-agenda/:id", [md_auth.ensureAuth], AgendaController.deleteAgenda);

api.post("/talk", [md_auth.ensureAuth], AgendaController.saveTalk);

module.exports = api;
