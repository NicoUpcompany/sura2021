const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "asDHYdsvCRGSCdcognitivagbvASVBGFDcszxbVCAvds";

exports.createAccessToken = function(user) {
    const payload = {
        id: user._id,
        fullName: user.fullName,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        enterprise: user.enterprise,
        position: user.position,
        phone: user.phone,
        role: user.role,
        agendaDaysName: user.agendaDaysName,
        agendaDaysNumber: user.agendaDaysNumber,
        agenda: user.agenda,
        createToken: moment().unix(),
        exp: moment().add(10, "hours").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function(user) {
    const payload = {
        id: user._id,
        fullName: user.fullName,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        enterprise: user.enterprise,
        position: user.position,
        phone: user.phone,
        role: user.role,
        agendaDaysName: user.agendaDaysName,
        agendaDaysNumber: user.agendaDaysNumber,
        agenda: user.agenda,
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function(token) {
    return jwt.decode(token, SECRET_KEY, true);
};
