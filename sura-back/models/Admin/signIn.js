const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const singInSchema = Schema({
	logo: { type: String, default: "" },
	widthLogo: { type: String, default: "500px" },
	heightLogo: { type: String, default: "auto" },
	statusCode: { type: Boolean, default: false },
	htmlCode: { type: String, default: "" },
	cssCode: { type: String, default: "" },
	jsCode: { type: String, default: "" },
	background: { type: String, default: "" },
	title: { type: String, default: "" },
	text: { type: String, default: "" },
	buttonBackground: { type: String, default: "" },
	buttonBackgroundHover: { type: String, default: "" },
	titlesColors: { type: String, default: "" },
	textsColors: { type: String, default: "" },
	chronometerColors: { type: String, default: "" },
});

module.exports = mongoose.model("SignIn", singInSchema);
