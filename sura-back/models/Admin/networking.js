const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const networkingSchema = Schema({
	name: { type: String, default: "" },
	APP_ID: { type: String, default: "" },
	AUTH_KEY: { type: String, default: "" },
	trialEndsAt: { type: String, default: "" },
});

module.exports = mongoose.model("Networking", networkingSchema);
