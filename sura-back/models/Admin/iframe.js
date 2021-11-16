const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iframeSchema = Schema({
	link: { type: String, default: "" },
});

module.exports = mongoose.model("Iframe", iframeSchema);
