const jwt = require('../services/jwt');
const moment = require('moment');

const User = require('../models/user');

function willExpireToken(token) {
    const {exp} = jwt.decodedToken(token);
    const currentDate = moment().unix();

    if (currentDate > exp) {
        return true;
    }

    return false;
}

function refreshAccessToken(req, res) {
    const {refreshToken} = req.body;
    const isTokenExpired = willExpireToken(refreshToken);

    if (isTokenExpired) {
        res.status(404).send({ ok: false, message: "Inicia sesión nuevamente"});
    } else {
        const {id} = jwt.decodedToken(refreshToken);

        User.findOne({_id: id}, (err, userStored) => {
            if (err) {
                res.status(500).send({ ok: false, message: "Error del servidor"});
            } else {
                if (!userStored) {
                    res.status(404).send({ ok: false, message: "Usuario no encontrado"})
                } else {
                    res.status(200).send({
                        ok: true,
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    });
                }
            }
        });
    }
}

module.exports = {
    refreshAccessToken
};