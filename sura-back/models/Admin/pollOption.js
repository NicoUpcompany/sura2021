const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollOptionSchema = Schema({
    order: { type: Number, default: 0 },
    option: { type: String, default: "" },
	poll: { type: Schema.Types.ObjectId, ref: "Poll", default: null },
});

module.exports = mongoose.model("PollOption", pollOptionSchema);
