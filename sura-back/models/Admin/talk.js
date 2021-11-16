const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const talkSchema = Schema({
	order: { type: Number, default: 0 },
	hourStart: { type: String, default: "" },
	minuteStart: { type: String, default: "" },
	hourEnd: { type: String, default: "" },
	minuteEnd: { type: String, default: "" },
	title: { type: String, default: "" },
	duration: { type: String, default: "" },
	break: { type: Boolean, default: false },
	agenda: { type: Schema.Types.ObjectId, ref: "AdminAgenda", default: null },
});

module.exports = mongoose.model("Talk", talkSchema);
