const UserAgenda = require("../models/userAgenda");

function getUsersByAgenda(req, res) {
    UserAgenda.find().then(data => {
        if (!data) {
            res.status(404).send({ ok: false, message: "No hay data disponible"});
        } else {
            res.status(200).send({ ok: true, data});
        }
    });
}

module.exports = {
    getUsersByAgenda
};
