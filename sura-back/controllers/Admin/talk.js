const mongoose = require("mongoose");
const moment = require("moment");

const Talk = require("../../models/Admin/talk");

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

function getTalks(req, res) {
	const { agenda } = req.params;

	Talk.find({ agenda: mongoose.Types.ObjectId(agenda) })
		.sort({ order: "asc" })
		.then((talk) => {
			if (talk.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ninguna charla",
				});
			} else {
				res.status(200).send({ ok: true, talk });
			}
		});
}

function getAllTalks(req, res) {
	Talk.find()
		.sort({ order: "asc" })
		.then((talk) => {
			if (talk.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ninguna charla",
				});
			} else {
				res.status(200).send({ ok: true, talk });
			}
		});
}

function updateTalk(req, res) {
	let talkData = req.body;
	const params = req.params;

	Talk.findByIdAndUpdate({ _id: params.id }, talkData, (err, talkUpdate) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!talkUpdate) {
				res.status(404).send({
					ok: false,
					message: "Charla no encontrada",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Charla actualizada",
				});
			}
		}
	});
}

function deleteTalk(req, res) {
	const { id } = req.params;

	Talk.findByIdAndRemove(id, (err, talkDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!talkDeleted) {
				res.status(404).send({
					ok: false,
					message: "Charla no encontrada",
				});
			} else {
				res.status(200).send({ ok: true, message: "Charla eliminada" });
			}
		}
	});
}

module.exports = {
	saveTalk,
	getTalks,
	getAllTalks,
	updateTalk,
	deleteTalk,
};
