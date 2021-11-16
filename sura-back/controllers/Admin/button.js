const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Button = require("../../models/Admin/button");
const Stand = require("../../models/Admin/stand");

function newButton(req, res) {
	let functionStatus = true;
	const button = new Button();

	const {
		order,
		text,
		whatsapp,
		whatsappNumber,
		whatsappText,
		file,
		redirect,
		redirectUrl,
		agenda,
		stand,
	} = req.body;

	button.order = order;
	button.text = text;
	button.stand = stand;
	if (whatsapp && !file && !redirect && !agenda) {
		button.whatsapp = whatsapp;
		button.whatsappNumber = whatsappNumber;
		button.whatsappText = whatsappText;
	} else if (file && !whatsapp && !redirect && !agenda) {
		button.file = file;
	} else if (redirect && !whatsapp && !file && !agenda) {
		button.redirect = redirect;
		button.redirectUrl = redirectUrl;
	} else if (agenda && !redirect && !whatsapp && !file) {
		button.agenda = agenda;
	} else {
		functionStatus = false;
		res.status(400).send({
			ok: false,
			message: "Solo puede quedar un estado activo",
		});
	}
	if (functionStatus) {
		Stand.find(
			{ _id: mongoose.Types.ObjectId(stand) },
			(err, standStored) => {
				if (err) {
					res.status(500).send({
						ok: false,
						message: "Error de servidor",
					});
				} else {
					if (!standStored) {
						res.status(404).send({
							ok: false,
							message: `No existe un stand con el id ${stand}`,
						});
					} else {
						button.save((err, buttonStored) => {
							if (err) {
								res.status(500).send({
									ok: false,
									message: "Error de servidor",
								});
							} else {
								if (!buttonStored) {
									res.status(404).send({
										ok: false,
										message: "Error al crear el botón",
									});
								} else {
									res.status(200).send({
										ok: true,
										message: "Botón creado",
										buttonId: buttonStored.id,
									});
								}
							}
						});
					}
				}
			}
		);
	}
}

function getFile(req, res) {
	const fileName = req.params.file;
	const filePath = "./uploads/button/" + fileName;

	fs.exists(filePath, (exists) => {
		if (!exists) {
			res.status(404).send({
				ok: false,
				message: "Archivo no encontrado",
			});
		} else {
			res.sendFile(path.resolve(filePath));
		}
	});
}

// function uploadFile(req, res) {
// 	const params = req.params;

// 	Button.findById({ _id: params.id }, (err, buttonData) => {
// 		if (err) {
// 			res.status(500).send({ ok: false, message: "Error del servidor" });
// 		} else {
// 			if (!buttonData) {
// 				res.status(404).send({
// 					ok: false,
// 					message: "Botón no encontrado",
// 				});
// 			} else {
// 				let button = buttonData;

// 				if (req.files) {
// 					let filePath = req.files.file.path;
// 					let fileName = filePath.replace(/^.*[\\\/]/, "");
// 					let extSplit = fileName.split(".");
// 					let fileExt = extSplit[1];

// 					if (
// 						fileExt !== "pdf" &&
// 						fileExt !== "rar" &&
// 						fileExt !== "zip"
// 					) {
// 						res.status(400).send({
// 							ok: false,
// 							message:
// 								"La extension del archivo no es válida. (Extensiones permitidas: .pdf, .rar y .zip)",
// 						});
// 					} else {
// 						if (button.file) {
// 							button.image = fileName;
// 							Button.findByIdAndUpdate(
// 								{ _id: params.id },
// 								button,
// 								(err, buttonResult) => {
// 									if (err) {
// 										res.status(500).send({
// 											ok: false,
// 											message: "Error del servidor.",
// 										});
// 									} else {
// 										if (!buttonResult) {
// 											res.status(404).send({
// 												ok: false,
// 												message: "Botón no encontrado",
// 											});
// 										} else {
// 											res.status(200).send({
// 												ok: true,
// 												file: fileName,
// 											});
// 										}
// 									}
// 								}
// 							);
// 						} else {
// 							res.status(400).send({
// 								ok: false,
// 								message:
// 									"No está habilitada la opción de subir archivos",
// 							});
// 						}
// 					}
// 				}
// 			}
// 		}
// 	});
// }

function uploadFile(req, res) {
	const params = req.params;
	let functionStatus = true;

	console.log(1)
	Button.findById({ _id: params.id }, (err, buttonData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!buttonData) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ningún botón",
				});
			} else {
				let button = buttonData;

				if (button.file) {
					if (req.files) {
						let filePath = req.files.file.path;
						let fileName = filePath.replace(/^.*[\\\/]/, "");
						let extSplit = fileName.split(".");
						let fileExt = extSplit[1];

						if (
							fileExt !== "pdf" &&
							fileExt !== "rar" &&
							fileExt !== "zip"
						) {
							res.status(400).send({
								ok: false,
								message:
									"La extension del archivo no es válida. (Extensiones permitidas: .pdf, .rar y .zip)",
							});
						} else {
							button.fileName = fileName;
							if (functionStatus) {
								Button.findByIdAndUpdate(
									{ _id: params.id },
									button,
									(err, buttonResult) => {
										if (err) {
											res.status(500).send({
												ok: false,
												message: "Error del servidor.",
											});
										} else {
											if (!buttonResult) {
												res.status(404).send({
													ok: false,
													message:
														"No se ha encontrado ningún botón",
												});
											} else {
												res.status(200).send({
													ok: true,
													message:
														"Se subió el archivo correctamente",
													fileName,
												});
											}
										}
									}
								);
							}
						}
					} else {
						res.status(400).send({
							ok: false,
							message: "Archivo no encontrado",
						});
					}
				} else {
					res.status(400).send({
						ok: false,
						message:
							"No está habilitada la opción de subir archivos",
					});
				}
			}
		}
	});
}

function getButtons(req, res) {
	const params = req.params;

	Button.find({ stand: mongoose.Types.ObjectId(params.id) })
		.sort({ order: "asc" })
		.exec((err, buttons) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error del servidor",
				});
			} else {
				if (buttons.length === 0) {
					res.status(404).send({ ok: false, buttons: [] });
				} else {
					res.status(200).send({ ok: true, buttons });
				}
			}
		});
}

function updateButton(req, res) {
	let buttonData = req.body;
	const params = req.params;

	let functionStatus = true;

	Button.findById({ _id: params.id }, (err, buttonStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!buttonStored) {
				res.status(404).send({
					ok: false,
					message: "No se ha encontrado ningún botón",
				});
			} else {
				if (
					buttonData.whatsapp &&
					!buttonData.file &&
					!buttonData.redirect &&
					!buttonData.agenda
				) {
					functionStatus = true;
				} else if (
					buttonData.file &&
					!buttonData.whatsapp &&
					!buttonData.redirect &&
					!buttonData.agenda
				) {
					functionStatus = true;
				} else if (
					buttonData.redirect &&
					!buttonData.whatsapp &&
					!buttonData.file &&
					!buttonData.agenda
				) {
					functionStatus = true;
				} else if (
					buttonData.agenda &&
					!buttonData.redirect &&
					!buttonData.whatsapp &&
					!buttonData.file
				) {
					functionStatus = true;
				} else {
					functionStatus = false;
					res.status(400).send({
						ok: false,
						message: "Solo puede quedar un estado activo",
					});
				}
				if (functionStatus) {
					Button.findByIdAndUpdate(
						{ _id: params.id },
						buttonData,
						(err, buttonUpdate) => {
							if (err) {
								res.status(500).send({
									ok: false,
									message: "Error de servidor",
								});
							} else {
								if (!buttonUpdate) {
									res.status(404).send({
										ok: false,
										message: "No se ha encontrado el botón",
									});
								} else {
									res.status(200).send({
										ok: true,
										message: "Botón actualizado",
									});
								}
							}
						}
					);
				}
			}
		}
	});
}

function deleteButton(req, res) {
	const { id } = req.params;

	Button.findByIdAndRemove(id, (err, buttonDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!buttonDeleted) {
				res.status(404).send({
					ok: false,
					message: "Botón no encontrado",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Botón eliminado",
				});
			}
		}
	});
}

module.exports = {
	newButton,
	getFile,
	uploadFile,
	getButtons,
	updateButton,
	deleteButton,
};
