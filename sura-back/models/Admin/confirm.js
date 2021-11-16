const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confirmSchema = Schema({
	logo: { type: String, default: "" },
	background: { type: String, default: "" },
	text: { type: String, default: "" },
	buttonBackground: { type: String, default: "" },
	buttonBackgroundHover: { type: String, default: "" },
	titlesColors: { type: String, default: "" },
	textsColors: { type: String, default: "" },
	icons: { type: String, default: "" },
});

module.exports = mongoose.model("Confirm", confirmSchema);
