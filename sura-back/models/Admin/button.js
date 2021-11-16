const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buttonSchema = Schema({
	order: { type: Number, default: 0 },
	text: { type: String, default: "" },
	whatsapp: { type: Boolean, default: false },
	whatsappNumber: { type: String, default: "" },
	whatsappText: { type: String, default: "" },
	file: { type: Boolean, default: false },
	fileName: { type: String, default: "" },
	redirect: { type: Boolean, default: false },
	redirectUrl: { type: String, default: "" },
	agenda: { type: Boolean, default: false },
	agendaDays: [Object],
	stand: { type: Schema.Types.ObjectId, ref: "Stands", default: null },
});

module.exports = mongoose.model("Button", buttonSchema);
