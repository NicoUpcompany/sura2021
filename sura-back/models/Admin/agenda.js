const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agendaSchema = Schema({
	order: { type: Number, default: 0 },
	year: { type: String, default: "" },
	month: { type: String, default: "" },
	day: { type: String, default: "" },
});

module.exports = mongoose.model("AdminAgenda", agendaSchema);
