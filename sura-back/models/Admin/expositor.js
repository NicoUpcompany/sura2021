const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expositorSchema = Schema({
    order: { type: Number, default: 0 },
	title: { type: String, default: "" },
	name: { type: String, default: "" },
	image: { type: String, default: "" },
	position: { type: String, default: "" },
	enterprise: { type: String, default: "" },
	talk: { type: Schema.Types.ObjectId, ref: "Talk", default: null },
});

module.exports = mongoose.model("Expositor", expositorSchema);
