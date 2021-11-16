const fs = require("fs");
const path = require("path");

const SignUp = require("../../models/Admin/signUp");

function saveSignUpOptions(req, res) {
	const signUp = new SignUp();
	const { title, description, buttonBackground, buttonBackgroundHover, titlesColors, textsColors } = req.body;

	signUp.title = title;
	signUp.description = description;
	signUp.buttonBackground = buttonBackground;
	signUp.buttonBackgroundHover = buttonBackgroundHover;
	signUp.titlesColors = titlesColors;
	signUp.textsColors = textsColors;
	signUp.save((err, signUpStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!signUpStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar las opciones del registro",
				});
			} else {
				res.status(200).send({
					ok: true,
					signUpId: signUpStored.id,
					message: "Configuración guardada",
				});
			}
		}
	});
}

function getSignUpOptions(req, res) {
	SignUp.find().then((signUp) => {
		if (signUp.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible la configuración del registro",
			});
		} else {
			res.status(200).send({ ok: true, signUp: signUp[0] });
		}
	});
}

function updateSignUpOptions(req, res) {
	let signUpData = req.body;
	const params = req.params;

	SignUp.findByIdAndUpdate(
		{ _id: params.id },
		signUpData,
		(err, signUpUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!signUpUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no está disponible la configuración del registro",
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

function uploadImage(req, res) {
	const params = req.params;

	SignUp.findById({ _id: params.id }, (err, signUpData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!signUpData) {
				res.status(404).send({
					ok: false,
					message:
						"No se ha encontrado ninguna configuración del registro",
				});
			} else {
				let signUp = signUpData;

				if (req.files) {
					console.log(req.files)
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
						signUp.image = fileName;
						SignUp.findByIdAndUpdate(
							{ _id: params.id },
							signUp,
							(err, signUpResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!signUpResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración del registro",
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
	const filePath = "./uploads/signUp/" + image;

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
	saveSignUpOptions,
	getSignUpOptions,
	updateSignUpOptions,
	uploadImage,
	getImage,
};
