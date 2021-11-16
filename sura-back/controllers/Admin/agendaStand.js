require('dotenv').config();
const nodemailer = require("nodemailer");
const request = require("request");
const mongoose = require('mongoose');
const moment = require("moment");
require('moment/locale/es');

const AgendaStand = require("../../models/Admin/agendaStand");
const Button = require("../../models/Admin/button");
const User = require("../../models/user");
const Accreditation = require("../../models/Admin/accreditation");

const upEmail = process.env.EMAIL;
const upPassword = process.env.PASSWORD_EMAIL;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: upEmail,
        pass: upPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

function newAgendaStand(req, res) {

    const { startTimeYear, startTimeMonth, startTimeDay, startTimeHour, startTimeMinute, startTimeSecond, endTimeYear, endTimeMonth, endTimeDay, endTimeHour, 
        endTimeMinute, endTimeSecond, duration, type, rest, typeRest, days, owner, button, weekend } = req.body;

    const startTime = new Date(startTimeYear, startTimeMonth, startTimeDay, startTimeHour, startTimeMinute, startTimeSecond);
    const endTime = new Date(endTimeYear, endTimeMonth, endTimeDay, endTimeHour, endTimeMinute, endTimeSecond);
    let arrayObj = [];
    let agendaDays = [];
    let agendaNumber = [];
    let functionStatus = true;
    let auxDays = days;
    let auxStartTime = startTime;
    let auxEndTime = endTime;
    let cycle = true;
    let durationAux = 0;

    if (moment(startTime) && moment(endTime)) {
        if (type === 'hours' || type === 'minutes' || type === 'seconds') {
            if (duration <= 60 && duration > 0) {
                if (type === 'hours' && duration > 24) {
                    res.status(400).send({ ok: false, message: "La duración no es válida" });
                } else {
                    if (type === 'hours') {
                        durationAux = duration * 60;
                    } else if (type === 'seconds') {
                        durationAux = duration / 60;
                    } else {
                        durationAux = duration;
                    }
                    if (days > 0) {
                        let startingTime = new Date(startTime).getTime();
                        let finishTime = new Date(endTime).getTime();
                        let aux = moment(startTime).format();
                        let auxFinish = moment(endTime).format();
                        while (functionStatus && auxDays > 0) {
                            
                            let d = new Date(aux);
                            
                            let auxGetDay = d.getDay();
                            if ((!weekend && auxGetDay === 6) || (!weekend && auxGetDay === 0)) {
                                if (cycle) {
                                    aux = moment(auxStartTime).add(1, "days").format();
                                    auxFinish = new moment(auxEndTime).add(1, "days").format();
                                    cycle = false;
                                } else {
                                    aux = moment(aux).add(1, "days").format();
                                    auxFinish = new moment(auxFinish).add(1, "days").format();
                                }
                            } else {
                                cycle = true;
                                d = new Date(aux);
                                let n = d.getHours();
                                let auxN = minTwoDigits(n);
                                let x = d.getMinutes();
                                let auxX = minTwoDigits(x);
                                
                                let day = d.getDate();
                                aux = moment(aux).add(duration, type).format();
                                
                                let d2 = new Date(aux);
                                let n2 = d2.getHours();
                                let auxN2 = minTwoDigits(n2);
                                let x2 = d2.getMinutes();
                                let auxX2 = minTwoDigits(x2);
                                
                                const time = `${auxN}:${auxX} - ${auxN2}:${auxX2}`;
                                // minutos de descanso
                                aux = moment(aux).add(rest, typeRest).format();
                                const data = {
                                    time: moment(d).format(),
                                    hour: time,
                                    day,
                                    owner,
                                    button
                                }
                                arrayObj.push(data);
                                
                                startingTime = new Date(aux).getTime();
                                finishTime = new Date(auxFinish).getTime();
        
                                if (finishTime <= startingTime) {
                                    const arrayOfDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                                    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                                    const monthNumber = new Date(moment(d).format()).getMonth();
                                    const yearNumber = new Date(moment(d).format()).getFullYear();
                                    const data = {
                                        day: `${arrayOfDays[auxGetDay]} ${day} de ${monthNames[monthNumber]} de ${yearNumber}`,
                                        numberDay: day,
                                        owner,
                                        duration: durationAux,
                                        days,
                                        startTime,
                                        endTime,
                                        weekend
                                    }
                                    agendaDays.push(data);
                                    agendaNumber.push(day);
                                    if (auxDays > 0) {
                                        auxDays = auxDays - 1;
                                        auxStartTime = moment(auxStartTime).add(1, "days").format();
                                        aux = moment(auxStartTime).format();
                                        auxEndTime = moment(auxEndTime).add(1, "days").format();
                                        auxFinish = new Date(moment(auxEndTime).format()).getTime();
                                    } else {
                                        functionStatus = false;
                                    }
                                }
                            }
                        }
                        Button.findById({ _id: button }, (err, buttonStored) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor" });
                            } else {
                                if (!buttonStored) {
                                    res.status(404).send({ ok: false, message: "No se ha encontrado ningún botón" });
                                } else {
                                    buttonStored.agendaDays = agendaDays;
                                    Button.findByIdAndUpdate({ _id: buttonStored.id }, buttonStored, (err, buttonUpdate) => {
                                        if (err) {
                                            res.status(500).send({ ok: false, message: "Error de servidor"});
                                        } else {
                                            if (!buttonUpdate) {
                                                res.status(404).send({ ok: false, message: "No se ha encontrado el botón"});
                                            } else {
                                                AgendaStand.insertMany(arrayObj).then(function(){
                                                    User.findById({ _id: owner }, (err, userStored) => {
                                                        if (err) {
                                                            res.status(500).send({ ok: false, message: "Error del servidor" });
                                                        } else {
                                                            if (!userStored) {
                                                                res.status(404).send({ ok: false, message: "No se ha encontrado el usuario"});
                                                            } else {
                                                                userStored.agendaDaysName = agendaDays;
                                                                userStored.agendaDaysNumber = agendaNumber;
                                                                userStored.agenda = true;
                                                                User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
                                                                    if (err) {
                                                                        res.status(500).send({ message: "Error del servidor" });
                                                                    } else {
                                                                        if (!userUpdate) {
                                                                            res.status(404).send({
                                                                                message: "No se ha encontrado el usuario",
                                                                            });
                                                                        } else {
                                                                            res.status(200).send({ ok: true, message: "Agendamiento creado correctamente", array: arrayObj }); 
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }).catch(function(error){
                                                    res.status(500).send({ ok: false, message: error }); 
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        
                    } else {
                        res.status(400).send({ ok: false, message: "La cantidad de días es incorrecta" });
                    }
                }
            } else {
                res.status(400).send({ ok: false, message: "La duración no es válida" });
            }
        } else {
            res.status(400).send({ ok: false, message: "El tipo de duración de las reuniones no es válido" });
        }
    } else {
        res.status(400).send({ ok: false, message: "Fechas no válidas" });
    }
}

function scheduling (req, res) {

    const { id } = req.params;
    const { user, description } = req.body;

    AgendaStand.findById({_id: id}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                if (agendaStored.user !== null) {
                    res.status(403).send({ ok: false, message: "Este horario ya ha sido agendado"});
                } else {
                    agendaStored.user = user;
                    agendaStored.description = description;
                    AgendaStand.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                        if (err) {
                            res.status(500).send({ ok: false, message: "Error del servidor"});
                        } else {
                            if (!agendaUpdate) {
                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                            } else {
                                User.findById({_id: user}, (err, userStored) => {
                                    if (err) {
                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                    } else {
                                        if (!userStored) {
                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                        } else {
                                            const data = {
                                                properties: {
                                                    lang: 'es',
                                                    enable_chat: true,
                                                    enable_screenshare: true
                                                }
                                            }
                                            const options = {
                                                method: 'POST',
                                                "rejectUnauthorized": false,
                                                url: 'https://api.daily.co/v1/rooms',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: 'Bearer 89f4f3900e44f726a1d5afc01609bda3aabbc8028942e9f29dd8f22bdbd06fe3'
                                                },
                                                body: data,
                                                json: true
                                            };
                                    
                                            request(options, function (error, response, body) {
                                                if (error) {
                                                    res.status(500).send({ ok: false, message: error })
                                                } else {
                                                    agendaStored.link = body.url;
                                                    AgendaStand.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                                                        if (err) {
                                                            res.status(500).send({ ok: false, message: "Error del servidor"});
                                                        } else {
                                                            if (!agendaUpdate) {
                                                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                                            } else {
                                                                User.findById({_id: agendaStored.owner}, (err, ownerStored) => {
                                                                    if (err) {
                                                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                    } else {
                                                                        if (!ownerStored) {
                                                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                                                        } else {
                                                                            Accreditation.find().then((accreditation) => {
                                                                                if (accreditation.length === 0) {
                                                                                    res.status(404).send({
                                                                                        ok: false,
                                                                                        message: "Aún no se ha subido los ajustes de acreditación",
                                                                                    });
                                                                                } else {
                                                                                    const verifyAccreditation = accreditation[0];
                                                                                    const mailOptions = {
                                                                                        from: `${verifyAccreditation.from} <${upEmail}>`,
                                                                                        to: `${userStored.email}`,
                                                                                        subject: 'Reunión agendada',
                                                                                        text: `Reunión a las ${agendaStored.hour} del día ${agendaStored.day} agendada (link: ${body.url})`,
                                                                                        html: `
                                                                                        <html>
                                                                                            <head>
                                                                                            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                                                                                                <title>Cognitiva</title>
                                                                                            </head>
                                                                                            <body style="background:#f6f6f6;">
                                                                                                <div style="background:url('https://upcompany.cl/mailing/cognitiva/110521/back.jpg') center center no-repeat;background-size: cover;color:#fff; width:100%; max-width: 650px; margin: 0 auto; padding: 50px 0;font-family: Montserrat, sans-serif;">
                                                                                                
                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;">
                                                                                                        <tr>
                                                                                                            <th align="left" width="100%" style="padding: 0;"> 
                                                                                                                <a href="https://selectgroup.cl/">
                                                                                                                    <img src="https://upcompany.cl/mailing/cognitiva/110521/img1.png" width="600" />
                                                                                                                </a>
                                                                                                            </th>
                                                                                                        </tr>
                                                                                                    </table>

                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0 0;padding: 20px 0;">
                                                                                                        <tr>
                                                                                                            <td align="center" width="100%" style="color: #fff;">
                                                                                                                <h2 style="font-size: 26px;"><strong>Reunión agendada</strong></h2>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>

                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;padding: 0 50px;">
                                                                                                        <tr>
                                                                                                            <td align="left" width="40%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon1.png"></td>
                                                                                                                        <td style="color: #fff;">
                                                                                                                            <strong>JUEVES 27</strong><br/>DE MAYO
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                            <td align="left" width="60%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon2.png"></td>
                                                                                                                        <td style="color: #fff;">
                                                                                                                            <strong>${agendaStored.hour}</strong>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 80px;padding: 0 50px;">
                                                                                                        <tr>
                                                                                                            <td align="center" width="100%" style="color: #fff;">
                                                                                                                <a href="${body.url}" style="text-decoration: none; margin: 0;font-size: 20px; background: transparent; border: 1px solid #e5007e; padding: 10px; border-radius: 5px; color: #fff; cursor: pointer;">
                                                                                                                    Ir a la reunión
                                                                                                                </a>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>

                                                                                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 0px;padding: 0 50px;">
                                                                                                        <tr>
                                                                                                            <td align="center" style="color: #fff;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s1.png"></td>
                                                                                                                        <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                            <a href="https://www.facebook.com/cognitivala" style="color: #fff;text-decoration: none;">/ cognitivala</a>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                            <td align="center" style="color: #fff;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s2.png"></td>
                                                                                                                        <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                            <a href="https://twitter.com/cognitiva_la" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                            <td align="center" style="color: #fff;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s3.png"></td>
                                                                                                                        <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                            <a href="https://www.linkedin.com/company/cognitiva-chile/?originalSubdomain=cl" style="color: #fff;text-decoration: none;">/ cognitiva-chile</a>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                            <td align="center" style="color: #fff;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s4.png"></td>
                                                                                                                        <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                            <a href="https://www.instagram.com/cognitiva_la/?hl=es" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                            <td align="center" style="color: #fff;">
                                                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                    <tr>
                                                                                                                        <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s5.png"></td>
                                                                                                                        <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                            <a href="https://www.youtube.com/channel/UCnjc5DAAWJPojKfQhYMBTcw" style="color: #fff;text-decoration: none;">/ Cognitiva Chile</a>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </body>
                                                                                        </html>
                                                                                        `
                                                                                    };
                                                                                    transporter.sendMail(mailOptions, function(error, info){
                                                                                        if(error){
                                                                                            res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                                        } else {
                                                                                            const mailOptions2 = {
                                                                                                from: `${verifyAccreditation.from} <${upEmail}>`,
                                                                                                to: `${ownerStored.email}`,
                                                                                                subject: 'Te han agendado una reunión',
                                                                                                text: `Reunión a las ${agendaStored.hour} del día ${agendaStored.day} agendada (link: ${body.url})`,
                                                                                                html: `
                                                                                                <html>
                                                                                                    <head>
                                                                                                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                                                                                                        <title>Cognitiva</title>
                                                                                                    </head>
                                                                                                    <body style="background:#f6f6f6;">
                                                                                                        <div style="background:url('https://upcompany.cl/mailing/cognitiva/110521/back.jpg') center center no-repeat;background-size: cover;color:#fff; width:100%; max-width: 650px; margin: 0 auto; padding: 50px 0;font-family: Montserrat, sans-serif;">
                                                                                                        
                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;">
                                                                                                                <tr>
                                                                                                                    <th align="left" width="100%" style="padding: 0;"> 
                                                                                                                        <a href="https://selectgroup.cl/">
                                                                                                                            <img src="https://upcompany.cl/mailing/cognitiva/110521/img1.png" width="600" />
                                                                                                                        </a>
                                                                                                                    </th>
                                                                                                                </tr>
                                                                                                            </table>

                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0 0;padding: 20px 0;">
                                                                                                                <tr>
                                                                                                                    <td align="center" width="100%" style="color: #fff;">
                                                                                                                        <h2 style="font-size: 26px;"><strong>Te han agendado una reunión</strong></h2>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>

                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;padding: 0 50px;">
                                                                                                                <tr>
                                                                                                                    <td align="left" width="40%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon1.png"></td>
                                                                                                                                <td style="color: #fff;">
                                                                                                                                    <strong>${agendaStored.day}</strong><br/>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                    <td align="left" width="60%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon2.png"></td>
                                                                                                                                <td style="color: #fff;">
                                                                                                                                    <strong>${agendaStored.hour}</strong>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 80px;padding: 0 50px;">
                                                                                                                <tr>
                                                                                                                    <td align="center" width="100%" style="color: #fff;">
                                                                                                                        <a href="${body.url}" style="text-decoration: none; margin: 0;font-size: 20px; background: transparent; border: 1px solid #e5007e; padding: 10px; border-radius: 5px; color: #fff; cursor: pointer;">
                                                                                                                            Ir a la reunión
                                                                                                                        </a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>

                                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 0px;padding: 0 50px;">
                                                                                                                <tr>
                                                                                                                    <td align="center" style="color: #fff;">
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s1.png"></td>
                                                                                                                                <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                                    <a href="https://www.facebook.com/cognitivala" style="color: #fff;text-decoration: none;">/ cognitivala</a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                    <td align="center" style="color: #fff;">
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s2.png"></td>
                                                                                                                                <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                                    <a href="https://twitter.com/cognitiva_la" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                    <td align="center" style="color: #fff;">
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s3.png"></td>
                                                                                                                                <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                                    <a href="https://www.linkedin.com/company/cognitiva-chile/?originalSubdomain=cl" style="color: #fff;text-decoration: none;">/ cognitiva-chile</a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                    <td align="center" style="color: #fff;">
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s4.png"></td>
                                                                                                                                <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                                    <a href="https://www.instagram.com/cognitiva_la/?hl=es" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                    <td align="center" style="color: #fff;">
                                                                                                                        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                                            <tr>
                                                                                                                                <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s5.png"></td>
                                                                                                                                <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                                                    <a href="https://www.youtube.com/channel/UCnjc5DAAWJPojKfQhYMBTcw" style="color: #fff;text-decoration: none;">/ Cognitiva Chile</a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </div>
                                                                                                    </body>
                                                                                                </html>
                                                                                                `
                                                                                            };
                                                                                            transporter.sendMail(mailOptions2, function(error, info){
                                                                                                if(error){
                                                                                                    res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                                                } else {
                                                                                                    res.status(200).send({
                                                                                                        ok: true,
                                                                                                        link: body.url,
                                                                                                        message: "Reunión agendada correctamente, te hemos enviado un correo con la confirmación y el link de reunión"
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

function getAgendaAvailableByDay(req, res) {
    const { button, day } = req.body;

    AgendaStand.find({$and: [ { active: {$ne: false} }, { button: mongoose.Types.ObjectId(button) }, { day: day.toString() }, { user: null } ]}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            console.log(agendaStored)
            if (agendaStored.length === 0) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                const agendaArray = [];
                let length = agendaStored.length;
                agendaStored.forEach(element => {
                    console.log(element)
                    const now = new Date(moment().subtract(3, 'hours').format()).getTime();
                    const eventTime =  new Date(moment().format(element.time)).getTime();
                    if (eventTime > now) {
                        agendaArray.push(element);
                    }
                    length = length - 1;
                    if (length === 0 ) {
                        res.status(200).send({ ok: true, agenda: agendaArray });
                    }
                });
            }
        }
    });
}

function getAgendaByOwner(req, res) {
    const { owner, day } = req.body;

    AgendaStand.find({$and: [ { owner: mongoose.Types.ObjectId(owner) }, { day: day.toString() }]}).populate('user', 'fullName name lastname email position enterprise').exec((err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (agendaStored.length === 0) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                res.status(200).send({ ok: true, agenda: agendaStored });
            }
        }
    });
}

function getAgendaAll(req, res) {
    const { button } = req.params;

    AgendaStand.find({ button: mongoose.Types.ObjectId(button) }, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                res.status(200).send({ ok: true, agenda: agendaStored });
            }
        }
    });
}

function changeAgendaStatus(req, res) {
    const { id } = req.params;

    let userId = null;

    AgendaStand.findById({_id: id}, (err, agendaStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!agendaStored) {
                res.status(404).send({ ok: false, message: "Agenda no encontrada"});
            } else {
                if (agendaStored.user === null) {
                    if (agendaStored.active) {
                        agendaStored.active = false;
                        AgendaStand.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor"});
                            } else {
                                if (!agendaUpdate) {
                                    res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                } else {
                                    res.status(200).send({
                                        ok: true,
                                        message: `El horario ${agendaStored.hour} del día ${agendaStored.day} se ha marcado como no disponible`
                                    });
                                }
                            }
                        });
                    } else {
                        agendaStored.active = true;
                        AgendaStand.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                            if (err) {
                                res.status(500).send({ ok: false, message: "Error del servidor"});
                            } else {
                                if (!agendaUpdate) {
                                    res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                                } else {
                                    res.status(200).send({
                                        ok: true,
                                        message: `El horario ${agendaStored.hour} del día ${agendaStored.day} se ha marcado como disponible`
                                    });
                                }
                            }
                        });
                    }
                } else {
                    userId = agendaStored.user;
                    agendaStored.user = null;
                    agendaStored.link = "";
                    agendaStored.description = "";
                    AgendaStand.findByIdAndUpdate({ _id: agendaStored.id }, agendaStored, (err, agendaUpdate) => {
                        if (err) {
                            res.status(500).send({ ok: false, message: "Error del servidor"});
                        } else {
                            if (!agendaUpdate) {
                                res.status(404).send({ ok: false, message: "No se ha encontrado la agenda"});
                            } else {
                                User.findById({_id: userId}, (err, userStored) => {
                                    if (err) {
                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                    } else {
                                        if (!userStored) {
                                            res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                        } else {
                                            User.findById({_id: agendaStored.owner}, (err, ownerStored) => {
                                                if (err) {
                                                    res.status(500).send({ ok: false, message: "Error del servidor"});
                                                } else {
                                                    if (!ownerStored) {
                                                        res.status(404).send({ ok: false, message: "Usuario no encontrado"});
                                                    } else {
                                                        Accreditation.find().then((accreditation) => {
                                                            if (accreditation.length === 0) {
                                                                res.status(404).send({
                                                                    ok: false,
                                                                    message: "Aún no se ha subido los ajustes de acreditación",
                                                                });
                                                            } else {
                                                                const verifyAccreditation = accreditation[0];
                                                                const mailOptions = {
                                                                    from: `${verifyAccreditation.from} <${upEmail}>`,
                                                                    to: `${userStored.email}, ${ownerStored.email}`,
                                                                    subject: 'Reunión cancelada',
                                                                    text: `La reunión a las ${agendaStored.hour} del día ${agendaStored.day} fue cancelada`,
                                                                    html: `
                                                                    <html>
                                                                        <head>
                                                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                                                                            <title>Cognitiva</title>
                                                                        </head>
                                                                        <body style="background:#f6f6f6;">
                                                                            <div style="background:url('https://upcompany.cl/mailing/cognitiva/110521/back.jpg') center center no-repeat;background-size: cover;color:#fff; width:100%; max-width: 650px; margin: 0 auto; padding: 50px 0;font-family: Montserrat, sans-serif;">
                                                                            
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;">
                                                                                    <tr>
                                                                                        <th align="left" width="100%" style="padding: 0;"> 
                                                                                            <a href="https://selectgroup.cl/">
                                                                                                <img src="https://upcompany.cl/mailing/cognitiva/110521/img1.png" width="600" />
                                                                                            </a>
                                                                                        </th>
                                                                                    </tr>
                                                                                </table>

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0 0;padding: 20px 0;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%" style="color: #fff;">
                                                                                            <h2 style="font-size: 26px;"><strong>Reunión cancelada</strong></h2>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0;padding: 0 50px;">
                                                                                    <tr>
                                                                                        <td align="left" width="40%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon1.png"></td>
                                                                                                    <td style="color: #fff;">
                                                                                                        <strong>JUEVES 27</strong><br/>DE MAYO
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="left" width="60%" style="color:#fff;padding: 30px 20px;border-top: 1px solid #e5007e;border-bottom: 1px solid #e5007e;"> 
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td><img src="https://upcompany.cl/mailing/cognitiva/110521/icon2.png"></td>
                                                                                                    <td style="color: #fff;">
                                                                                                        <strong>${agendaStored.hour}</strong>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 50px 0 80px;padding: 0 50px;">
                                                                                    <tr>
                                                                                        <td align="center" width="100%" style="color: #fff;">
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>

                                                                                <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 0px;padding: 0 50px;">
                                                                                    <tr>
                                                                                        <td align="center" style="color: #fff;">
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s1.png"></td>
                                                                                                    <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                        <a href="https://www.facebook.com/cognitivala" style="color: #fff;text-decoration: none;">/ cognitivala</a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" style="color: #fff;">
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s2.png"></td>
                                                                                                    <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                        <a href="https://twitter.com/cognitiva_la" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" style="color: #fff;">
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s3.png"></td>
                                                                                                    <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                        <a href="https://www.linkedin.com/company/cognitiva-chile/?originalSubdomain=cl" style="color: #fff;text-decoration: none;">/ cognitiva-chile</a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" style="color: #fff;">
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s4.png"></td>
                                                                                                    <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                        <a href="https://www.instagram.com/cognitiva_la/?hl=es" style="color: #fff;text-decoration: none;">/ cognitiva_la</a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td align="center" style="color: #fff;">
                                                                                            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="">
                                                                                                <tr>
                                                                                                    <td valign="middle"><img src="https://upcompany.cl/mailing/cognitiva/110521/s5.png"></td>
                                                                                                    <td valign="middle" style="color: #fff; font-size: 10px;">
                                                                                                        <a href="https://www.youtube.com/channel/UCnjc5DAAWJPojKfQhYMBTcw" style="color: #fff;text-decoration: none;">/ Cognitiva Chile</a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </div>
                                                                        </body>
                                                                    </html>
                                                                    `
                                                                };
                                                                transporter.sendMail(mailOptions, function(error, info){
                                                                    if(error){
                                                                        res.status(500).send({ ok: false, message: "Error del servidor"});
                                                                    } else {
                                                                        res.status(200).send({
                                                                            ok: true,
                                                                            message: "Reunión cancelada correctamente"
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
}

module.exports = {
    newAgendaStand,
    scheduling,
    getAgendaAvailableByDay,
    getAgendaByOwner,
    getAgendaAll,
    changeAgendaStatus
}; 