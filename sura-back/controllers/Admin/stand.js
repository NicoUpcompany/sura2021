const fs = require("fs");
const path = require("path");

const Stands = require("../../models/Admin/stand");

function validURL(str) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
}

function newStand(req, res) {
	const stands = new Stands();

	const {
		order,
		name,
		type,
		phone,
		email,
		page,
		title,
		description,
		video,
		redirect1,
		redirect2,
		redirect3,
		redirect4,
		redirect5,
		redirect6,
	} = req.body;

	const standType = type.toUpperCase();
	stands.order = order;
	stands.name = name;
	stands.type = standType;
	stands.title = title;
	stands.description = description;
	stands.phone = phone;
	stands.email = email;
	stands.page = page;
	stands.redirect1 = redirect1;
	stands.redirect2 = redirect2;
	stands.redirect3 = redirect3;
	stands.redirect4 = redirect4;
	stands.redirect5 = redirect5;
	stands.redirect6 = redirect6;
	if (validURL(video)) {
		stands.video = video;
		if (
			standType === "XL" ||
			standType === "L" ||
			standType === "M" ||
			standType === "S"
		) {
			stands.save((err, standsStored) => {
				if (err) {
					res.status(500).send({
						ok: false,
						message: "Error de servidor",
					});
				} else {
					if (!standsStored) {
						res.status(404).send({
							ok: false,
							message: "Error al crear el stand",
						});
					} else {
						res.status(200).send({
							ok: true,
							message: "Stand creado",
							standId: standsStored.id,
						});
					}
				}
			});
		} else {
			res.status(400).send({
				ok: false,
				message: "El tipo de stand no es correcto",
			});
		}
	} else {
		res.status(400).send({
			ok: false,
			message: "El link de video no es válido",
		});
	}
}

function getImage(req, res) {
	const image = req.params.image;
	const filePath = "./uploads/stands/" + image;

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

function uploadImage(req, res) {
	const params = req.params;
	const { imgType } = req.body;

	let functionStatus = true;
	const auxImgType = imgType.toUpperCase();

	Stands.findById({ _id: params.id }, (err, standData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!standData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ningún stand",
				});
			} else {
				let stand = standData;

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
						if (auxImgType === "BANNER") {
							stand.banner = fileName;
						} else if (auxImgType === "LOGO") {
							stand.logo = fileName;
						} else if (auxImgType === "LOGOEXT") {
							stand.logoExt = fileName;
						} else if (auxImgType === "HEADER") {
							stand.header = fileName;
						} else if (auxImgType === "IMAGE1") {
							stand.image1 = fileName;
						} else if (auxImgType === "IMAGE2") {
							if (stand.image1.length <= 0) {
								functionStatus = false;
								res.status(400).send({
									ok: false,
									message:
										"Debes subir las imagenes en orden",
								});
							} else {
								stand.image2 = fileName;
							}
						} else if (auxImgType === "IMAGE3") {
							if (
								stand.image1.length <= 0 ||
								stand.image2.length <= 0
							) {
								functionStatus = false;
								res.status(400).send({
									ok: false,
									message:
										"Debes subir las imagenes en orden",
								});
							} else {
								stand.image3 = fileName;
							}
						} else if (auxImgType === "IMAGE4") {
							if (
								stand.image1.length <= 0 ||
								stand.image2.length <= 0 ||
								stand.image3.length <= 0
							) {
								functionStatus = false;
								res.status(400).send({
									ok: false,
									message:
										"Debes subir las imagenes en orden",
								});
							} else {
								stand.image4 = fileName;
							}
						} else if (auxImgType === "IMAGE5") {
							if (
								stand.image1.length <= 0 ||
								stand.image2.length <= 0 ||
								stand.image3.length <= 0 ||
								stand.image4.length <= 0
							) {
								functionStatus = false;
								res.status(400).send({
									ok: false,
									message:
										"Debes subir las imagenes en orden",
								});
							} else {
								stand.image5 = fileName;
							}
						} else if (auxImgType === "IMAGE6") {
							if (
								stand.image1.length <= 0 ||
								stand.image2.length <= 0 ||
								stand.image3.length <= 0 ||
								stand.image4.length <= 0 ||
								stand.image5.length <= 0
							) {
								functionStatus = false;
								res.status(400).send({
									ok: false,
									message:
										"Debes subir las imagenes en orden",
								});
							} else {
								stand.image6 = fileName;
							}
						} else {
							functionStatus = false;
							res.status(400).send({
								ok: false,
								message: "Tipo de imagen no válido",
							});
						}
						if (functionStatus) {
							Stands.findByIdAndUpdate(
								{ _id: params.id },
								stand,
								(err, standResult) => {
									if (err) {
										res.status(500).send({
											ok: false,
											message: "Error del servidor.",
										});
									} else {
										if (!standResult) {
											res.status(404).send({
												ok: false,
												message:
													"No se ha encontrado ningún stand",
											});
										} else {
											res.status(200).send({
												ok: true,
												message:
													"Imagen subida correctamente",
												imageName: fileName,
											});
										}
									}
								}
							);
						}
					}
				}
			}
		}
	});
}

function getStands(req, res) {
	Stands.find()
		.sort({ order: "asc" })
		.exec((err, stands) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error del servidor",
				});
			} else {
				if (stands.length === 0) {
					res.status(404).send({ ok: false, stands: [] });
				} else {
					res.status(200).send({ ok: true, stands });
				}
			}
		});
}

function updateStands(req, res) {
	let standData = req.body;
	const params = req.params;

	Stands.findById({ _id: params.id }, (err, standStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!standStored) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ningún stand",
				});
			} else {
				if (standData.type === "S") {
					standData.video = "";
				}
				Stands.findByIdAndUpdate(
					{ _id: params.id },
					standData,
					(err, standsUpdate) => {
						if (err) {
							res.status(500).send({
								ok: false,
								message: "Error de servidor",
							});
						} else {
							if (!standsUpdate) {
								res.status(404).send({
									ok: false,
									message: "No se ha encontrado el stand",
								});
							} else {
								res.status(200).send({
									ok: true,
									message: "Stand actualizado",
								});
							}
						}
					}
				);
			}
		}
	});
}

function deleteStands(req, res) {
	const { id } = req.params;

	Stands.findByIdAndRemove(id, (err, standDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!standDeleted) {
				res.status(404).send({
					ok: false,
					message: "Stand no encontrado",
				});
			} else {
				res.status(200).send({ ok: true, message: "Stand eliminado" });
			}
		}
	});
}

module.exports = {
	newStand,
	getImage,
	uploadImage,
	getStands,
	updateStands,
	deleteStands,
};
