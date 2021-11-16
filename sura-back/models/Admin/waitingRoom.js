const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waitingRoomSchema = Schema({
	header: { type: String, default: "" },
	headerColor: { type: String, default: "" },
	headerTextColor: { type: String, default: "" },
	headerTextHoverColor: { type: String, default: "" },
	headerChronometerColor: { type: String, default: "" },
	buttonColor: { type: String, default: "" },
	buttonHoverColor: { type: String, default: "" },
	logo: { type: String, default: "" },
	networking: { type: Boolean, default: true },
	networkingColor: { type: String, default: "" },
	networkingText: { type: String, default: "" },
	networkingTextColor: { type: String, default: "" },
	status: { type: Boolean, default: true },
	agendaTitleColor: { type: String, default: "" },
	agendaHeaderBackground: { type: String, default: "" },
	agendaActiveDay: { type: String, default: "" },
	agendaDay: { type: String, default: "" },
	agendaText: { type: String, default: "" },
	agenda: { type: Boolean, default: true },
	stand: { type: Boolean, default: true },
	standTitle: { type: String, default: "" },
	standTitleColor: { type: String, default: "" },
	footerColor: { type: String, default: "" },
});

module.exports = mongoose.model("WaitingRoom", waitingRoomSchema);
