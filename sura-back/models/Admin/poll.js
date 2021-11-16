const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = Schema({
	order: { type: Number, default: 0 },
	question: { type: String, default: "" },
	timeStartYear: { type: String, default: "" },
	timeStartMonth: { type: String, default: "" },
	timeStartDay: { type: String, default: "" },
	timeStartHour: { type: String, default: "" },
	timeStartMinute: { type: String, default: "" },
	timeStartSecond: { type: String, default: "" },
	timeEndYear: { type: String, default: "" },
	timeEndMonth: { type: String, default: "" },
	timeEndDay: { type: String, default: "" },
	timeEndHour: { type: String, default: "" },
	timeEndMinute: { type: String, default: "" },
	timeEndSecond: { type: String, default: "" },
	method: { type: String, default: "" },
	active: { type: Boolean, default: false },
});

module.exports = mongoose.model("Poll", pollSchema);
