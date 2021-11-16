const Networking = require("../../models/Admin/networking");

function saveNetworking(req, res) {
	const networking = new Networking();
	const { name, APP_ID, AUTH_KEY, trialEndsAt } = req.body;

	networking.name = name;
	networking.APP_ID = APP_ID;
	networking.AUTH_KEY = AUTH_KEY;
	networking.trialEndsAt = trialEndsAt;
	networking.save((err, networkingStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!networkingStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar los datos de networking",
				});
			} else {
				res.status(200).send({
					ok: true,
					networkingId: networkingStored.id,
					message: "Networking generado",
				});
			}
		}
	});
}

function getNetworking(req, res) {
	Networking.find().then((networking) => {
		if (networking.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible el networking",
			});
		} else {
			res.status(200).send({ ok: true, networking: networking[0] });
		}
	});
}

function updateNetworking(req, res) {
	let networkingData = req.body;
	const params = req.params;

	Networking.findByIdAndUpdate(
		{ _id: params.id },
		networkingData,
		(err, networkingUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!networkingUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no está disponible el networking",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Credenciales actualizadas",
					});
				}
			}
		}
	);
}

module.exports = {
	saveNetworking,
	getNetworking,
	updateNetworking,
};
