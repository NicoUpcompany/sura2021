const moment = require("moment");
require('moment/locale/es');

function getTime(req, res) {
    const time = moment().subtract(3, 'hours').format();
    const eventTime = new Date(2021, 1, 17, 11, 0, 0);
    res.status(200).send({ ok: true, time, eventTime });
}

module.exports = {
    getTime
}; 