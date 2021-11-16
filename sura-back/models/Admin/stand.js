const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const standsSchema = Schema({
	order: { type: Number, default: 0 },
	logoExt: { type: String, default: "" },
	logo: { type: String, default: "" },
	name: { type: String, default: "" },
	type: { type: String, default: "" },
	phone: { type: String, default: "" },
	email: { type: String, default: "" },
	page: { type: String, default: "" },
	title: { type: String, default: "" },
	description: { type: String, default: "" },
	header: { type: String, default: "" },
	banner: { type: String, default: "" },
	video: { type: String, default: "" },
	image1: { type: String, default: "" },
	redirect1: { type: String, default: "" },
	image2: { type: String, default: "" },
	redirect2: { type: String, default: "" },
	image3: { type: String, default: "" },
	redirect3: { type: String, default: "" },
	image4: { type: String, default: "" },
	redirect4: { type: String, default: "" },
	image5: { type: String, default: "" },
	redirect5: { type: String, default: "" },
	image6: { type: String, default: "" },
	redirect6: { type: String, default: "" },
});

module.exports = mongoose.model("Stand", standsSchema);
