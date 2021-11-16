const Color = require("../../models/Admin/color");

function saveColors(req, res) {
	const color = new Color();
	const { button, buttonHover, titlesColors, textsColors } = req.body;

	color.button = button;
	color.buttonHover = buttonHover;
	color.titlesColors = titlesColors;
	color.textsColors = textsColors;
	color.save((err, colorStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!colorStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar los colores de los botones",
				});
			} else {
				res.status(200).send({
					ok: true,
					colorId: colorStored.id,
					message: "Colores guardados",
				});
			}
		}
	});
}

function getColors(req, res) {
	Color.find().then((colors) => {
		if (colors.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no están disponibles los colores de los botones",
			});
		} else {
			res.status(200).send({ ok: true, colors: colors[0] });
		}
	});
}

function updateColors(req, res) {
	let colorData = req.body;
	const params = req.params;

	Color.findByIdAndUpdate(
		{ _id: params.id },
		colorData,
		(err, colorUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!colorUpdate) {
					res.status(404).send({
						ok: false,
						message:
							"Aún no están disponibles los colores de los botones",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Colores actualizados",
					});
				}
			}
		}
	);
}

module.exports = {
	saveColors,
	getColors,
	updateColors,
};
