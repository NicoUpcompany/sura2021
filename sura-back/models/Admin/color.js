const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = Schema({
	button: { type: String, default: "" },
	buttonHover: { type: String, default: "" },
	titlesColors: { type: String, default: "" },
	textsColors: { type: String, default: "" },
});

module.exports = mongoose.model("Color", colorSchema);
