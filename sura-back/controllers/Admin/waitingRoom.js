const fs = require("fs");
const path = require("path");

const WatingRoom = require("../../models/Admin/waitingRoom");

function saveWatingRoomOptions(req, res) {
	const watingRoom = new WatingRoom();
	const {
		networking,
		status,
		agenda,
		stand,
		headerColor,
		headerTextColor,
		headerTextHoverColor,
		headerChronometerColor,
		buttonColor,
		buttonHoverColor,
		networkingColor,
		networkingText,
		networkingTextColor,
		agendaTitleColor,
		agendaHeaderBackground,
		agendaActiveDay,
		agendaDay,
		agendaText,
		standTitle,
		standTitleColor,
		footerColor,
	} = req.body;

	watingRoom.networking = networking;
	watingRoom.status = status;
	watingRoom.agenda = agenda;
	watingRoom.stand = stand;
	watingRoom.headerColor = headerColor;
	watingRoom.headerTextColor = headerTextColor;
	watingRoom.headerTextHoverColor = headerTextHoverColor;
	watingRoom.headerChronometerColor = headerChronometerColor;
	watingRoom.buttonColor = buttonColor;
	watingRoom.buttonHoverColor = buttonHoverColor;
	watingRoom.networkingColor = networkingColor;
	watingRoom.networkingText = networkingText;
	watingRoom.networkingTextColor = networkingTextColor;
	watingRoom.agendaTitleColor = agendaTitleColor;
	watingRoom.agendaHeaderBackground = agendaHeaderBackground;
	watingRoom.agendaActiveDay = agendaActiveDay;
	watingRoom.agendaDay = agendaDay;
	watingRoom.agendaText = agendaText;
	watingRoom.standTitle = standTitle;
	watingRoom.standTitleColor = standTitleColor;
	watingRoom.footerColor = footerColor;
	watingRoom.save((err, waitingRoomStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!waitingRoomStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar",
				});
			} else {
				res.status(200).send({
					ok: true,
					waitingRoomId: waitingRoomStored.id,
					message: "Configuración guardada",
				});
			}
		}
	});
}

function getWaitingRoomOptions(req, res) {
	WatingRoom.find().then((waitingRoom) => {
		if (waitingRoom.length === 0) {
			res.status(404).send({
				ok: false,
				message:
					"Aún no está disponible la configuración de la sala de espera",
			});
		} else {
			res.status(200).send({ ok: true, waitingRoom: waitingRoom[0] });
		}
	});
}

function updateWaitingRoomOptions(req, res) {
	let waitingRoomData = req.body;
	const params = req.params;

	WatingRoom.findByIdAndUpdate(
		{ _id: params.id },
		waitingRoomData,
		(err, waitingRoomUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!waitingRoomUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no está disponible la configuración de la sala de espera",
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

	WatingRoom.findById({ _id: params.id }, (err, waitingRoomData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!waitingRoomData) {
				res.status(404).send({
					ok: false,
					message:
						"No se ha encontrado ninguna configuración de la sala de espera",
				});
			} else {
				let waitingRoom = waitingRoomData;

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
						waitingRoom.logo = fileName;
						WatingRoom.findByIdAndUpdate(
							{ _id: params.id },
							waitingRoom,
							(err, waitingRoomResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!waitingRoomResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración de la sala de espera",
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

function uploadHeader(req, res) {
	const params = req.params;

	WatingRoom.findById({ _id: params.id }, (err, waitingRoomData) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!waitingRoomData) {
				res.status(404).send({
					ok: false,
					message:
						"No se ha encontrado ninguna configuración de la sala de espera",
				});
			} else {
				let waitingRoom = waitingRoomData;

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
						waitingRoom.header = fileName;
						WatingRoom.findByIdAndUpdate(
							{ _id: params.id },
							waitingRoom,
							(err, waitingRoomResult) => {
								if (err) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor.",
									});
								} else {
									if (!waitingRoomResult) {
										res.status(404).send({
											ok: false,
											message:
												"No se ha encontrado ninguna configuración de la sala de espera",
										});
									} else {
										res.status(200).send({
											ok: true,
											header: fileName,
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
	const filePath = "./uploads/waitingroom/" + image;

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
	saveWatingRoomOptions,
	getWaitingRoomOptions,
	updateWaitingRoomOptions,
	uploadLogo,
	uploadHeader,
	getImage,
};
