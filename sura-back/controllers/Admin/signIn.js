const fs = require("fs");
const path = require("path");

const SignIn = require("../../models/Admin/signIn");

function saveSignInOptions(req, res) {
	const signIn = new SignIn();
	const { title, text, buttonBackground, buttonBackgroundHover, titlesColors, textsColors, chronometerColors } = req.body;

	signIn.title = title;
	signIn.text = text;
	signIn.buttonBackground = buttonBackground;
	signIn.buttonBackgroundHover = buttonBackgroundHover;
	signIn.titlesColors = titlesColors;
	signIn.textsColors = textsColors;
	signIn.chronometerColors = chronometerColors;
	signIn.save((err, signInStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!signInStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar",
				});
			} else {
				res.status(200).send({
					ok: true,
					signInId: signInStored.id,
					message: "Configuración guardada",
				});
			}
		}
	});
}

function getSignInOptions(req, res) {
	SignIn.find().then((signIn) => {
		if (signIn.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible la configuración del inicio de sesión",
			});
		} else {
			res.status(200).send({ ok: true, signIn: signIn[0] });
		}
	});
}

function resizeSignInLogo(req, res) {
	const { widthLogo, heightLogo } = req.body;
	const params = req.params;

	SignIn.findById({ _id: params.id }, (err, signInStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!signInStored) {
				res.status(404).send({
					ok: false,
					message: "Aún no está disponible la configuración del inicio de sesión",
				});
			} else {
				signInStored.widthLogo = widthLogo;
				signInStored.heightLogo = heightLogo;
				SignIn.findByIdAndUpdate({ _id: signInStored.id }, signInStored, (err, signInUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!signInUpdate) {
							res.status(404).send({
								ok: false,
								message: "Aún no está disponible la configuración del inicio de sesión",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Configuración actualizada",
							});
						}
					}
				});
			}
		}
	});
}

function updateSignInOptions(req, res) {
	let signInData = req.body;
	const params = req.params;

	SignIn.findById({ _id: params.id }, (err, signInStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!signInStored) {
				res.status(404).send({
					ok: false,
					message: "Aún no está disponible la configuración del inicio de sesión",
				});
			} else {
				signInStored.title = signInData.title;
				signInStored.text = signInData.text;
				signInStored.widthLogo = signInData.widthLogo;
				signInStored.heightLogo = signInData.heightLogo;
				signInStored.buttonBackground = signInData.buttonBackground;
				signInStored.buttonBackgroundHover = signInData.buttonBackgroundHover;
				signInStored.titlesColors = signInData.titlesColors;
				signInStored.textsColors = signInData.textsColors;
				signInStored.chronometerColors = signInData.chronometerColors;
				signInStored.statusCode = signInData.statusCode;
				signInStored.htmlCode = signInData.htmlCode;
				signInStored.cssCode = signInData.cssCode;
				signInStored.jsCode = signInData.jsCode;
				SignIn.findByIdAndUpdate({ _id: signInStored.id }, signInStored, (err, signInUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!signInUpdate) {
							res.status(404).send({
								ok: false,
								message: "Aún no está disponible la configuración del inicio de sesión",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Configuración actualizada",
							});
						}
					}
				});
			}
		}
	});
}

function uploadLogo(req, res) {
	const params = req.params;

	SignIn.findById({ _id: params.id }, (err, signInData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!signInData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ninguna configuración del inicio de sesión",
				});
			} else {
				let signIn = signInData;

				if (req.files) {
					let filePath = req.files.image.path;
					let fileName = filePath.replace(/^.*[\\\/]/, "");
					let extSplit = fileName.split(".");
					let fileExt = extSplit[1];

					if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
						res.status(400).send({
							ok: false,
							message: "La extension de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
						});
					} else {
						signIn.logo = fileName;
						SignIn.findByIdAndUpdate({ _id: params.id }, signIn, (err, signInResult) => {
							if (err) {
								res.status(500).send({
									ok: false,
									message: "Error del servidor.",
								});
							} else {
								if (!signInResult) {
									res.status(404).send({
										ok: false,
										message: "No se ha encontrado ninguna configuración del inicio de sesión",
									});
								} else {
									res.status(200).send({
										ok: true,
										logo: fileName,
									});
								}
							}
						});
					}
				}
			}
		}
	});
}

function uploadBackground(req, res) {
	const params = req.params;

	SignIn.findById({ _id: params.id }, (err, signInData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!signInData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ninguna configuración del inicio de sesión",
				});
			} else {
				let signIn = signInData;

				if (req.files) {
					let filePath = req.files.image.path;
					let fileName = filePath.replace(/^.*[\\\/]/, "");
					let extSplit = fileName.split(".");
					let fileExt = extSplit[1];

					if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
						res.status(400).send({
							ok: false,
							message: "La extension de la imagen no es válida. (Extensiones permitidas: .png y .jpg)",
						});
					} else {
						signIn.background = fileName;
						SignIn.findByIdAndUpdate({ _id: params.id }, signIn, (err, signInResult) => {
							if (err) {
								res.status(500).send({
									ok: false,
									message: "Error del servidor.",
								});
							} else {
								if (!signInResult) {
									res.status(404).send({
										ok: false,
										message: "No se ha encontrado ninguna configuración del inicio de sesión",
									});
								} else {
									res.status(200).send({
										ok: true,
										background: fileName,
									});
								}
							}
						});
					}
				}
			}
		}
	});
}

function getImage(req, res) {
	const image = req.params.image;
	const filePath = "./uploads/signIn/" + image;

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
	saveSignInOptions,
	getSignInOptions,
	resizeSignInLogo,
	updateSignInOptions,
	uploadLogo,
	uploadBackground,
	getImage,
};
