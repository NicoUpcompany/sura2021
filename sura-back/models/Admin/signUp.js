const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signUpSchema = Schema({
	image: { type: String, default: "" },
	title: { type: String, default: "" },
	description: { type: String, default: "" },
	buttonBackground: { type: String, default: "" },
	buttonBackgroundHover: { type: String, default: "" },
	titlesColors: { type: String, default: "" },
	textsColors: { type: String, default: "" },
});

module.exports = mongoose.model("SignUp", signUpSchema);
