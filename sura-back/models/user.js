const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validRoles = {
	values: ["Admin", "User"],
	message: "{VALUE} no es un rol permitido",
};

const userSchema = Schema({
	fullName: { type: String, default: "" },
	name: { type: String, default: "" },
	lastname: { type: String, default: "" },
	email: { type: String, required: true, unique: true },
	rut: { type: String, default: "" },
	enterprise: { type: String, default: "" },
	position: { type: String, default: "" },
	phone: { type: String, default: "" },
	country: { type: String, default: "" },
	adress: { type: String, default: "" },
	code: { type: String, default: "" },
	other: { type: String, default: "" },
	signInTime: { type: String, default: "0" },
	signUpTime: { type: String, default: "0" },
	waitingRoomTime: { type: String, default: "0" },
	streamTime: { type: String, default: "0" },
	role: { type: String, default: "User", enum: validRoles },
	active: { type: Boolean, default: true },
	agendaDaysName: [Object],
	agendaDaysNumber: [Object],
	agenda: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
