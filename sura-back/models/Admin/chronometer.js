const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chronometerSchema = Schema({
	year: { type: String, default: "" },
	month: { type: String, default: "" },
	day: { type: String, default: "" },
	hour: { type: String, default: "" },
	minute: { type: String, default: "" },
	second: { type: String, default: "" },
});

module.exports = mongoose.model("Chrono", chronometerSchema);
