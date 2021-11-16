const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const realTimeSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", default: null },
	flagIcon: { type: String, default: "" },
	city: { type: String, default: "" },
	postalCode: { type: String, default: "" },
	continent: { type: String, default: "" },
	continentCode: { type: String, default: "" },
	country: { type: String, default: "" },
	countryIsoCode: { type: String, default: "" },
	locationLatLong: { type: String, default: "" },
	accuracyRadius: { type: String, default: "" },
	timeZone: { type: String, default: "" },
	region: { type: String, default: "" },
	regionIsoCode: { type: String, default: "" },
	ipAddress: { type: String, default: "" },
	ipType: { type: String, default: "" },
	isp: { type: String, default: "" },
	conectionType: { type: String, default: "" },
	navigatorName: { type: String, default: "" },
	operatingSystem: { type: String, default: "" },
	conectionTime: { type: String, default: "" },
	conectionTimeEnd: { type: String, default: "" },
});

module.exports = mongoose.model("RealTimeData", realTimeSchema);
