const fs = require("fs");
const path = require("path");

const OptionsEvent = require("../../models/Admin/optionsEvent");

function saveOptionsEvent(req, res) {
	const optionsEvent = new OptionsEvent();
	const { title, description, index, ga } = req.body;

	optionsEvent.title = title;
	optionsEvent.description = description;
	optionsEvent.index = index;
	optionsEvent.ga = ga;
	optionsEvent.save((err, optionsEventStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!optionsEventStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar los ajustes del evento",
				});
			} else {
				res.status(200).send({
					ok: true,
					optionsEventId: optionsEventStored.id,
					message: "Ajustes guardados",
				});
			}
		}
	});
}

function getOptionsEvent(req, res) {
	OptionsEvent.find().then((optionsEvent) => {
		if (optionsEvent.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no están disponibles los ajustes del evento",
			});
		} else {
			res.status(200).send({ ok: true, optionsEvent: optionsEvent[0] });
		}
	});
}

function updateOptionsEvent(req, res) {
	let optionsEventData = req.body;
	const params = req.params;

	OptionsEvent.findByIdAndUpdate(
		{ _id: params.id },
		optionsEventData,
		(err, optionsEventUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!optionsEventUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no están disponibles los ajustes del evento",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Ajustes actualizados",
					});
				}
			}
		}
	);
}

function uploadFavicon(req, res) {
	const params = req.params;

	OptionsEvent.findById({ _id: params.id }, (err, optionsEventData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!optionsEventData) {
				res.status(404).send({
					ok: false,
					message:
						"No se ha encontrado ninguna configuración del evento",
				});
			} else {
				let optionsEvent = optionsEventData;

				if (req.files) {
					let filePath = req.files.image.path;
					let fileName = filePath.replace(/^.*[\\\/]/, "");
					let extSplit = fileName.split(".");
					let fileExt = extSplit[1];

					if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
						res.status(400).send({
							ok: false,
							message:
								"La extension de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
						});
					} else {
						optionsEvent.favicon = fileName;
						OptionsEvent.findByIdAndUpdate(
							{ _id: params.id },
							optionsEvent,
							(err, optionsEventResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!optionsEventResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración del evento",
										});
									} else {
										res.status(200).send({
											ok: true,
											favicon: fileName,
										});
									}
								}
							}
						);
					}
				}
			}
		}
	});
}

function getFavicon(req, res) {
	const image = req.params.image;
	const filePath = "./uploads/optionsevent/" + image;

	fs.exists(filePath, (exists) => {
		if (!exists) {
			res.status(404).send({
				ok: false,
				message: "Favicon no encontrado",
			});
		} else {
			res.sendFile(path.resolve(filePath));
		}
	});
}

module.exports = {
	saveOptionsEvent,
	getOptionsEvent,
	updateOptionsEvent,
	uploadFavicon,
	getFavicon,
};
