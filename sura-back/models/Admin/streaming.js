const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const streamingSchema = Schema({
	botonColor: { type: String, default: "" },
	botonHoverColor: { type: String, default: "" },
	networkingColor: { type: String, default: "" },
	questionBackgroundColor: { type: String, default: "" },
	questionTitleColor: { type: String, default: "" },
	questionTitle: { type: String, default: "" },
	networking: { type: Boolean, default: true },
	status: { type: Boolean, default: true },
	agenda: { type: Boolean, default: true },
	agendaTitleColor: { type: String, default: "" },
	agendaHeaderBackground: { type: String, default: "" },
	agendaActiveDay: { type: String, default: "" },
	agendaDay: { type: String, default: "" },
	agendaText: { type: String, default: "" },
	stand: { type: Boolean, default: true },
	standTitle: { type: String, default: "" },
	standTitleColor: { type: String, default: "" },
	footerColor: { type: String, default: "" },
});

module.exports = mongoose.model("Streaming", streamingSchema);
