const Iframe = require("../../models/Admin/iframe");

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

function saveIframe(req, res) {
	const iframe = new Iframe();
	const { link } = req.body;

	try {
		if (validURL(link)) {
			iframe.link = link;
			iframe.save((err, iframeStored) => {
				if (err) {
					res.status(500).send({
						ok: false,
						message: "Error de servidor",
					});
				} else {
					if (!iframeStored) {
						res.status(404).send({
							ok: false,
							message: "Error al guardar el iframe del evento",
						});
					} else {
						res.status(200).send({
							ok: true,
							link,
							linkId: iframeStored.id,
							message: "Iframe creado",
						});
					}
				}
			});
		} else {
			res.status(500).send({
				ok: false,
				message: "El iframe no es válido",
			});
		}
	} catch (error) {
		res.status(500).send({
			ok: false,
			message: "Error al validar el iframe",
		});
	}
}

function getIframe(req, res) {
	Iframe.find().then((iframe) => {
		if (!iframe) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible el iframe del evento",
			});
		} else {
			res.status(200).send({ ok: true, iframe: iframe[0] });
		}
	});
}

function updateIframe(req, res) {
	let iframeData = req.body;
	const params = req.params;

	try {
		if (validURL(iframeData.link)) {
			Iframe.findByIdAndUpdate(
				{ _id: params.id },
				iframeData,
				(err, iframeUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error de servidor",
						});
					} else {
						if (!iframeUpdate) {
							res.status(404).send({
								ok: false,
								message:
									"Aún no está disponible el iframe del evento",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Iframe actualizado",
							});
						}
					}
				}
			);
		} else {
			res.status(500).send({
				ok: false,
				message: "El iframe no es válido",
			});
		}
	} catch (error) {
		res.status(500).send({
			ok: false,
			message: "Error al validar el iframe",
		});
	}
}

module.exports = {
	saveIframe,
	getIframe,
	updateIframe,
};
