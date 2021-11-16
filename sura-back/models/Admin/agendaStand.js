const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agendaStandSchema = new Schema({
	time: { type: String, default: "0" },
	hour: { type: String, default: "0" },
	day: { type: String, default: "0" },
	description: { type: String, default: "" },
	link: { type: String, default: "" },
	active: { type: Boolean, default: true },
	user: { type: Schema.Types.ObjectId, ref: "User", default: null },
	owner: { type: Schema.Types.ObjectId, ref: "User", default: null },
	button: { type: Schema.Types.ObjectId, ref: "Buttons", default: null },
});

module.exports = mongoose.model("AgendaStand", agendaStandSchema);
