const Event = require("../models/event");
const moment = require("moment");
require('moment/locale/es');

function newEvent(req, res) {

    const { conectionType, page, stand, action, description, userId } = req.body;

    const conectionTime = moment().subtract(3, 'hours').format('LLL');

    const event = new Event();
    event.conectionType = conectionType;
    event.conectionTime = conectionTime;
    event.page = page;
    event.stand = stand;
    event.action = action;
    event.description = description;
    event.user = userId;
    event.save((err, eventStored) => {
        if (err) {
            res.status(400).send({ ok: false, message: "Error de servidor" });
        } else {
            if (!eventStored) {
                res.status(500).send({ ok: false, message: "Error al crear el evento" });
            } else {
                res.status(200).send({ ok: true, message: "Registro exitoso" });
            }
        }
    });
}

function getEvent(req, res) {
    
    Event.find({}).populate('user', 'name lastname email fullName').exec((err, eventStored) => {
        if (err) {
            res.status(400).send({ ok: false, message: "Error de servidor" });
        } else {
            if (!eventStored) {
                res.status(404).send({ok: false, eventos: []});
            } else {
                res.status(200).send({ok: true, eventos: eventStored})
            }
        }
    });
}

module.exports = {
    newEvent,
    getEvent
}; 