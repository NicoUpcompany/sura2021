const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollAnswerSchema = Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", default: null },
	poll: { type: Schema.Types.ObjectId, ref: "Poll", default: null },
	pollOption: {
		type: Schema.Types.ObjectId,
		ref: "PollOption",
		default: null,
	},
});

module.exports = mongoose.model("PollAnswer", pollAnswerSchema);
