const Accreditation = require("../../models/Admin/accreditation");

function saveAccreditation(req, res) {
	const accreditation = new Accreditation();
	let functionStatus = true;

	const {
		fullName,
		name,
		lastname,
		rut,
		enterprise,
		position,
		phone,
		country,
		adress,
		code,
		other,
		otherText,
		signIn,
		from,
		subject,
		html,
	} = req.body;

	if (fullName) {
		if (!name && !lastname) {
			accreditation.fullName = fullName;
		} else {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	} else {
		accreditation.fullName = false;
	}
	if (name) {
		if (!fullName) {
			accreditation.name = name;
		} else {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	} else {
		accreditation.name = false;
	}
	if (lastname) {
		if (!fullName) {
			accreditation.lastname = lastname;
		} else {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	} else {
		accreditation.lastname = false;
	}
	accreditation.from = from;
	accreditation.subject = subject;
	accreditation.html = html;
	if (rut) {
		accreditation.rut = rut;
	} else {
		accreditation.rut = false;
	}
	if (enterprise) {
		accreditation.enterprise = enterprise;
	} else {
		accreditation.enterprise = false;
	}
	if (position) {
		accreditation.position = position;
	} else {
		accreditation.position = false;
	}
	if (phone) {
		accreditation.phone = phone;
	} else {
		accreditation.phone = false;
	}
	if (country) {
		accreditation.country = country;
	} else {
		accreditation.country = false;
	}
	if (adress) {
		accreditation.adress = adress;
	} else {
		accreditation.adress = false;
	}
	if (other) {
		accreditation.other = other;
		accreditation.otherText = otherText;
	} else {
		accreditation.other = false;
	}
	if (functionStatus) {
		accreditation.save((err, accreditationStored) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!accreditationStored) {
					res.status(404).send({
						ok: false,
						message: "Error al crear la acreditación",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Acreditación creada correctamente",
						acreditacionId: accreditationStored.id,
					});
				}
			}
		});
	}
}

function getAccreditation(req, res) {
	Accreditation.find().then((accreditation) => {
        if (accreditation.length > 0) {
            res.status(200).send({ ok: true, acreditacion: accreditation[0] });
		} else {
			res.status(404).send({
				ok: false,
				message: "Aún no se ha subido los ajustes de acreditación",
			});
		}
	});
}

function updateAccreditation(req, res) {
	let accreditationData = req.body;
	const params = req.params;
	let functionStatus = true;

	if (accreditationData.fullName) {
		if (accreditationData.name && accreditationData.lastname) {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	}
	if (accreditationData.name) {
		if (accreditationData.fullName) {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	}
	if (accreditationData.lastname) {
		if (accreditationData.fullName) {
			functionStatus = false;
			res.status(400).send({
				ok: false,
				message:
					"Solo puede estar activo Nombre Completo o Nombre y Apellido",
			});
		}
	}
	if (functionStatus) {
		Accreditation.findByIdAndUpdate(
			{ _id: params.id },
			accreditationData,
			(err, accreditationUpdate) => {
				if (err) {
					res.status(500).send({
						ok: false,
						message: "Error de servidor",
					});
				} else {
					if (!accreditationUpdate) {
						res.status(404).send({
							ok: false,
							message:
								"Aún no se ha subido los ajustes de acreditación",
						});
					} else {
						res.status(200).send({
							ok: true,
							message: "Acreditación actualizada",
						});
					}
				}
			}
		);
	}
}

module.exports = {
	saveAccreditation,
	getAccreditation,
	updateAccreditation,
};
