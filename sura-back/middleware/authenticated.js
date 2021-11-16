const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "asDHYdsvCRGSCdcognitivagbvASVBGFDcszxbVCAvds";

exports.ensureAuth = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(403).send({ ok: false, message: "La peticion no tiene la cabecera de Autenticacion." });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");
    let payload;

    try {
        payload = jwt.decode(token, SECRET_KEY);

        if (payload.exp <= moment().unix()) {
            return res.status(404).send({ ok: false, message: "El token ha expirado." });
        }
    } catch (ex) {
        return res.status(404).send({ ok: false, message: "Token invalido." });
    }
    req.user = payload;
    next();
};