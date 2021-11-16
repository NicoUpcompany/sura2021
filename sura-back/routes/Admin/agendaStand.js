const express = require("express");
const AgendaStandController = require("../../controllers/Admin/agendaStand");

const md_auth = require("../../middleware/authenticated");

const api = express.Router();

api.post(
	"/agenda-stand",
	[md_auth.ensureAuth],
	AgendaStandController.newAgendaStand
);
api.put(
	"/agenda-stand/:id",
	[md_auth.ensureAuth],
	AgendaStandController.scheduling
);
api.post(
	"/agenda-day",
	[md_auth.ensureAuth],
	AgendaStandController.getAgendaAvailableByDay
);
api.post(
	"/agenda-owner",
	[md_auth.ensureAuth],
	AgendaStandController.getAgendaByOwner
);
api.get(
	"/agenda-stand/:button",
	[md_auth.ensureAuth],
	AgendaStandController.getAgendaAll
);
api.put(
	"/change-agenda-status/:id",
	[md_auth.ensureAuth],
	AgendaStandController.changeAgendaStatus
);

module.exports = api;
