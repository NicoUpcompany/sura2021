const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionsEventSchema = Schema({
	title: { type: String, default: "" },
	description: { type: String, default: "" },
	favicon: { type: String, default: "" },
	ga: { type: String, default: "" },
	index: { type: String, default: "" },
});

module.exports = mongoose.model("OptionsEvent", optionsEventSchema);
