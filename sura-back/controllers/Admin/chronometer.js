const moment = require("moment");
require("moment/locale/es");

const Time = require("../../models/Admin/chronometer");

function saveTime(req, res) {
	const time = new Time();
	let functionStatus = true;
	const { year, month, day, hour, minute, second } = req.body;

	try {
		if (!isNaN(year)) {
			time.year = parseInt(year);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Año no válido" });
		}

		if (!isNaN(month)) {
			time.month = parseInt(month);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Mes no válido" });
		}

		if (!isNaN(day)) {
			time.day = parseInt(day);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Día no válido" });
		}

		if (!isNaN(hour)) {
			time.hour = parseInt(hour);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Hora no válida" });
		}

		if (!isNaN(minute)) {
			time.minute = parseInt(minute);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Minuto no válido" });
		}

		if (!isNaN(second)) {
			time.second = parseInt(second);
		} else {
			functionStatus = false;
			res.status(500).send({ ok: false, message: "Segundo no válido" });
		}
	} catch (error) {
		functionStatus = false;
		res.status(500).send({ ok: false, message: "Datos no válidos" });
	}

	if (functionStatus) {
		time.save((err, timeStored) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!timeStored) {
					res.status(404).send({
						ok: false,
						message: "Error al guardar la fecha del evento",
					});
				} else {
					res.status(200).send({
						ok: true,
						time: timeStored,
						message: "Fecha del evento creada",
					});
				}
			}
		});
	}
}

function getTime(req, res) {
	Time.find().then((time) => {
		if (time.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no está disponible la fecha del evento",
			});
		} else {
			const now = moment().subtract(4, "hours").format();
			const eventTime = new Date(
				time[0].year,
				time[0].month,
				time[0].day,
				time[0].hour,
				time[0].minute,
				time[0].second
			);
			res.status(200).send({
				ok: true,
				time: now,
				eventTime,
				timeId: time[0].id,
			});
		}
	});
}

function updateTime(req, res) {
	let timeData = req.body;
	const params = req.params;

	Time.findByIdAndUpdate({ _id: params.id }, timeData, (err, timeUpdate) => {
		if (err) {
			console.log(err)
			res.status(500).send({ ok: false, message: "Error de servidor" });
		} else {
			if (!timeUpdate) {
				res.status(404).send({
					ok: false,
					message: "Aún no está disponible la fecha del evento",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Fecha del evento actualizada",
				});
			}
		}
	});
}

module.exports = {
	saveTime,
	getTime,
	updateTime,
};
