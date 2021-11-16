const mongoose = require("mongoose");
const schedule = require("node-schedule");
const io = require("socket.io-client");
const moment = require("moment");
require("moment/locale/es");

const Agenda = require("../../models/Admin/agenda");
const Talk = require("../../models/Admin/talk");
const Expositor = require("../../models/Admin/expositor");

// const socket = io("https://cognitiva.upwebinar.cl/");
const socket = io("http://localhost:8080/");

function saveAgenda(req, res) {
	const agenda = new Agenda();
	const { year, month, day, order } = req.body;

	agenda.year = year;
	agenda.month = month;
	agenda.day = day;
	agenda.order = order;
	agenda.save((err, agendaStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!agendaStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar nueva agenda",
				});
			} else {
				socket.emit('NEW_AGENDA_DAY', agendaStored);
				res.status(200).send({
					ok: true,
					agendaId: agendaStored.id,
					message: "Agenda creada",
				});
			}
		}
	});
}

function getAgendas(req, res) {
	Agenda.find()
		.sort({ order: "asc" })
		.then((agenda) => {
			if (agenda.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ninguna agenda",
				});
			} else {
				res.status(200).send({ ok: true, agenda });
			}
		});
}

function saveTalk(req, res) {
	const talk = new Talk();
	const {
		hourStart,
		minuteStart,
		hourEnd,
		minuteEnd,
		title,
		order,
		agenda,
		breakVar,
	} = req.body;

	talk.hourStart = hourStart;
	talk.minuteStart = minuteStart;
	talk.hourEnd = hourEnd;
	talk.minuteEnd = minuteEnd;
	talk.title = title;
	talk.order = order;
	talk.agenda = agenda;
	talk.break = breakVar;
	const date1 = moment(`${hourStart}:${minuteStart}`, 'HH:mm').valueOf();
	const date2 = moment(`${hourEnd}:${minuteEnd}`, 'HH:mm').valueOf();
	const result = date2 - date1;
	if (result > 0) {
		const duration = result / 60000;
		talk.duration = duration;
		talk.save((err, talkStored) => {
		if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!talkStored) {
					res.status(404).send({
						ok: false,
						message: "Error al guardar nueva charla",
					});
				} else {
					socket.emit('NEW_AGENDA_TALK', talkStored);
					res.status(200).send({
						ok: true,
						talkId: talkStored.id,
						message: "Charla creada",
					});
				}
			}
		});
	} else {
		res.status(404).send({
			ok: false,
			message: "Horario no válido",
		});
	}
}

const getAgendasClient = async (req, res) => {
	const array = [];

	const agendas = await Agenda.find().sort({ order: "asc" });
	if (agendas.length > 0) {
		let length = agendas.length;
	
		agendas.forEach(async element => {
			let agendaObj = {};
			const talks = await Talk.find({ agenda: mongoose.Types.ObjectId(element._id) }).sort({ order: "asc" });
			let talkObj = {};
			if (talks.length > 0) {
				let talksArray = [];
				let length2 = talks.length;
				talks.forEach(async item => {
					const expositors = await Expositor.find({ talk: mongoose.Types.ObjectId(item._id) }).sort({ order: "asc" });
					if (expositors.length > 0) {
						talkObj = {
							talk: item,
							expositors: expositors,
						}
						talksArray.push(talkObj);
						length2 = length2 - 1;
						talkObj = {};
						if (length2 === 0) {
							agendaObj = {
								agenda: element,
								talk: talksArray,
							}
							array.push(agendaObj);
							agendaObj = {};
							talksArray = [];
							length = length - 1;
							if (length === 0) {
								res.status(200).send({ ok: true, agenda: array });
							}
						}
					} else {
						talkObj = {
							talk: item,
							expositors: [],
						}
						talksArray.push(talkObj);
						length2 = length2 - 1;
						talkObj = {};
						if (length2 === 0) {
							agendaObj = {
								agenda: element,
								talk: talksArray,
							}
							array.push(agendaObj);
							agendaObj = {};
							talksArray = [];
							length = length - 1;
							if (length === 0) {
								res.status(200).send({ ok: true, agenda: array });
							}
						}
					}
				});
			} else {
				agendaObj = {
					agenda: element,
					talk: [],
				}
				length = length - 1;
				array.push(agendaObj);
				agendaObj = {};
				talkObj = {};
				if (length === 0) {
					res.status(200).send({ ok: true, agenda: array });
				}
			}
		});
	} else {
		res.status(404).send({
			ok: false,
			message: "No se encontró ninguna agenda",
		});
	}
}

function updateAgenda(req, res) {
	let agendaData = req.body;
	const params = req.params;

	Agenda.findByIdAndUpdate(
		{ _id: params.id },
		agendaData,
		(err, agendaUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!agendaUpdate) {
					res.status(404).send({
						ok: false,
						message: "Agenda no encontrada",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Agenda actualizada",
					});
				}
			}
		}
	);
}

function deleteAgenda(req, res) {
	const { id } = req.params;

	Agenda.findByIdAndRemove(id, (err, agendaDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!agendaDeleted) {
				res.status(404).send({
					ok: false,
					message: "Agenda no encontrada",
				});
			} else {
				res.status(200).send({ ok: true, message: "Agenda eliminada" });
			}
		}
	});
}

module.exports = {
	saveAgenda,
	getAgendas,
	saveTalk,
	getAgendasClient,
	updateAgenda,
	deleteAgenda,
};
