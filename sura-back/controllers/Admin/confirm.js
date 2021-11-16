const fs = require("fs");
const path = require("path");

const Confirm = require("../../models/Admin/confirm");

function saveConfirmOptions(req, res) {
	const confirm = new Confirm();
	const { text, buttonBackground, buttonBackgroundHover, titlesColors, textsColors, icons } = req.body;

	confirm.text = text;
	confirm.buttonBackground = buttonBackground;
	confirm.buttonBackgroundHover = buttonBackgroundHover;
	confirm.titlesColors = titlesColors;
	confirm.textsColors = textsColors;
	confirm.icons = icons;
	confirm.save((err, confirmStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!confirmStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar",
				});
			} else {
				res.status(200).send({
					ok: true,
					confirmId: confirmStored.id,
					message: "Configuración guardada",
				});
			}
		}
	});
}

function getConfirmOptions(req, res) {
	Confirm.find().then((confirm) => {
		if (confirm.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible la configuración",
			});
		} else {
			res.status(200).send({ ok: true, confirm: confirm[0] });
		}
	});
}

function updateConfirmOptions(req, res) {
	let confirmData = req.body;
	const params = req.params;

	Confirm.findByIdAndUpdate(
		{ _id: params.id },
		confirmData,
		(err, confirmUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!confirmUpdate) {
					res.status(404).send({
						ok: false,
						message: "Aún no está disponible la configuración",
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

function uploadLogo(req, res) {
	const params = req.params;

	Confirm.findById({ _id: params.id }, (err, confirmData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!confirmData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ninguna configuración",
				});
			} else {
				let confirm = confirmData;

				if (req.files) {
					let filePath = req.files.image.path;
					let fileName = filePath.replace(/^.*[\\\/]/, "");
					let extSplit = fileName.split(".");
					let fileExt = extSplit[1];

					if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "jpeg") {
						res.status(400).send({
							ok: false,
							message:
								"La extension de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
						});
					} else {
						confirm.logo = fileName;
						Confirm.findByIdAndUpdate(
							{ _id: params.id },
							confirm,
							(err, confirmResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!confirmResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración",
										});
									} else {
										res.status(200).send({
											ok: true,
											logo: fileName,
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

function uploadBackground(req, res) {
	const params = req.params;

	Confirm.findById({ _id: params.id }, (err, confirmData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!confirmData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ninguna configuración",
				});
			} else {
				let confirm = confirmData;

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
						confirm.background = fileName;
						Confirm.findByIdAndUpdate(
							{ _id: params.id },
							confirm,
							(err, confirmResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!confirmResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración",
										});
									} else {
										res.status(200).send({
											ok: true,
											logo: fileName,
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
	const filePath = "./uploads/confirm/" + image;

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
	saveConfirmOptions,
	getConfirmOptions,
	updateConfirmOptions,
	uploadLogo,
	uploadBackground,
	getImage,
};
