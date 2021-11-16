const RealTime = require("../models/realTime");

function newRealTimeData(req, res) {

    const { user, city, continent, continentCode, country, countryIsoCode, accuracyRadius, locationLatLong, timeZone, region, regionIsoCode, 
        ipAddress, isp, navigatorName, SutonomousSystemOrganization, conectionType, conectionTime, conectionTimeEnd } = req.body;

    const realTimeData = new RealTime();
    realTimeData.user = user;
    realTimeData.city = city;
    realTimeData.continent = continent;
    realTimeData.continentCode = continentCode;
    realTimeData.country = country;
    realTimeData.countryIsoCode = countryIsoCode;
    realTimeData.accuracyRadius = accuracyRadius;
    realTimeData.locationLatLong = locationLatLong;
    realTimeData.timeZone = timeZone;
    realTimeData.region = region;
    realTimeData.regionIsoCode = regionIsoCode;
    realTimeData.ipAddress = ipAddress;
    realTimeData.isp = isp;
    realTimeData.SutonomousSystemOrganization = SutonomousSystemOrganization;
    realTimeData.navigatorName = navigatorName;
    realTimeData.conectionType = conectionType;
    realTimeData.conectionTime = conectionTime;
    realTimeData.conectionTimeEnd = conectionTimeEnd;
    realTimeData.save((err, realTimeDataStored) => {
        if (err) {
            res.status(400).send({ ok: false, message: "Error de servidor" });
        } else {
            if (!realTimeDataStored) {
                res.status(500).send({ ok: false, message: "Error al guardar data" });
            } else {
                res.status(200).send({ ok: true, message: "Registro exitoso" });
            }
        }
    });
}

function getRealTimeData(req, res) {
    
    RealTime.find({}).populate('user', 'name lastname fullName email').exec((err, realTimeDatatStored) => {
        if (err) {
            res.status(400).send({ ok: false, message: "Error de servidor" });
        } else {
            if (!realTimeDatatStored) {
                res.status(404).send({ok: false, realTimeData: []});
            } else {
                res.status(200).send({ok: true, realTimeData: realTimeDatatStored})
            }
        }
    });
}

module.exports = {
    newRealTimeData,
    getRealTimeData
}; 