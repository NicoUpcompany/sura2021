const Streaming = require("../../models/Admin/streaming");

function saveStreamingOptions(req, res) {
	const streaming = new Streaming();
	const {
		botonColor,
		botonHoverColor,
		networkingColor,
		questionBackgroundColor,
		questionTitleColor,
		questionTitle,
		networking,
		status,
		agenda,
		stand,
	} = req.body;

	streaming.botonColor = botonColor;
	streaming.botonHoverColor = botonHoverColor;
	streaming.networkingColor = networkingColor;
	streaming.questionBackgroundColor = questionBackgroundColor;
	streaming.questionTitleColor = questionTitleColor;
	streaming.questionTitle = questionTitle;
	streaming.networking = networking;
	streaming.status = status;
	streaming.agenda = agenda;
	streaming.stand = stand;
	streaming.save((err, streamingStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!streamingStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar",
				});
			} else {
				res.status(200).send({
					ok: true,
					streamingId: streamingStored.id,
					message: "Configuración guardada",
				});
			}
		}
	});
}

function getStreamingOptions(req, res) {
	Streaming.find().then((streaming) => {
		if (streaming.length === 0) {
			res.status(404).send({
				ok: false,
				message:
					"Aún no está disponible la configuración del streaming",
			});
		} else {
			res.status(200).send({ ok: true, streaming: streaming[0] });
		}
	});
}

function updateStreamingOptions(req, res) {
	let streamingmData = req.body;
	const params = req.params;

	Streaming.findByIdAndUpdate(
		{ _id: params.id },
		streamingmData,
		(err, streamingUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!streamingUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no está disponible la configuración del streaming",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Configuración actualizada",
					});
				}
			}
		}
	);
}

module.exports = {
	saveStreamingOptions,
	getStreamingOptions,
	updateStreamingOptions,
};
