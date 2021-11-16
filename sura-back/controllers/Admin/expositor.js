const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Expositor = require("../../models/Admin/expositor");

function saveExpositor(req, res) {
	const expositor = new Expositor();
	const { title, name, position, enterprise, order, talk } = req.body;

	expositor.title = title;
	expositor.name = name;
	expositor.position = position;
	expositor.enterprise = enterprise;
	expositor.order = order;
	expositor.talk = talk;
	expositor.save((err, expositorStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!expositorStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar nuevo expositor",
				});
			} else {
				res.status(200).send({
					ok: true,
					expositorId: expositorStored.id,
					message: "Expositor creado",
				});
			}
		}
	});
}

function getExpositor(req, res) {
	const { talk } = req.params;

	Expositor.find({ talk: mongoose.Types.ObjectId(talk) })
		.sort({ order: "asc" })
		.then((expositor) => {
			if (expositor.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ningun expositor",
				});
			} else {
				res.status(200).send({ ok: true, expositor });
			}
		});
}

function getAllExpositor(req, res) {
	Expositor.find()
		.sort({ order: "asc" })
		.then((expositor) => {
			if (expositor.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ningun expositor",
				});
			} else {
				res.status(200).send({ ok: true, expositor });
			}
		});
}

function updateExpositor(req, res) {
	let expositorData = req.body;
	const params = req.params;

	Expositor.findByIdAndUpdate(
		{ _id: params.id },
		expositorData,
		(err, expositorUpdate) => {
			if (err) {
				console.log(err);
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!expositorUpdate) {
					res.status(404).send({
						ok: false,
						message: "Expositor no encontrado",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Expositor actualizado",
					});
				}
			}
		}
	);
}

function deleteExpositor(req, res) {
	const { id } = req.params;

	Expositor.findByIdAndRemove(id, (err, expositorDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!expositorDeleted) {
				res.status(404).send({
					ok: false,
					message: "Expositor no encontrado",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Expositor eliminado",
				});
			}
		}
	});
}

function uploadImage(req, res) {
	const params = req.params;

	Expositor.findById({ _id: params.id }, (err, expositorData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!expositorData) {
				res.status(404).send({
					ok: false,
					message: "Expositor no encontrado",
				});
			} else {
				let expositor = expositorData;

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
						expositor.image = fileName;
						Expositor.findByIdAndUpdate(
							{ _id: params.id },
							expositor,
							(err, expositorResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!expositorResult) {
										res.status(404).send({
											ok: false,
											message: "Expositor no encontrado",
										});
									} else {
										res.status(200).send({
											ok: true,
											image: fileName,
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

function getImage(req, res) {
	const image = req.params.image;
	const filePath = "./uploads/expositor/" + image;

	fs.exists(filePath, (exists) => {
		if (!exists) {
			res.status(404).send({
				ok: false,
				message: "Imagen no encontrada",
			});
		} else {
			res.sendFile(path.resolve(filePath));
		}
	});
}

module.exports = {
	saveExpositor,
	getExpositor,
	getAllExpositor,
	updateExpositor,
	deleteExpositor,
	uploadImage,
	getImage,
};
