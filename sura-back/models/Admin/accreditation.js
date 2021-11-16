const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accreditationSchema = Schema({
	email: { type: Boolean, default: true },
	fullName: { type: Boolean, default: false },
	name: { type: Boolean, default: false },
	lastname: { type: Boolean, default: false },
	from: { type: String, default: "" },
	subject: { type: String, default: "" },
	html: { type: String, default: "" },
	rut: { type: Boolean, default: false },
	enterprise: { type: Boolean, default: false },
	position: { type: Boolean, default: false },
	phone: { type: Boolean, default: false },
	country: { type: Boolean, default: false },
	adress: { type: Boolean, default: false },
	other: { type: Boolean, default: false },
	otherText: { type: String, default: "" },
});

module.exports = mongoose.model("Accreditation", accreditationSchema);
