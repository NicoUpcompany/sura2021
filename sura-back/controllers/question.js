const Question = require("../models/question");
const moment = require("moment");
require('moment/locale/es');

function makeQuestion(req, res) {
    const { user, question } = req.body;
    const questionObj = new Question();

    const time = moment().subtract(3, 'hours').format('LLL');

    questionObj.user = user;
    questionObj.question = question;
    questionObj.time = time;

    questionObj.save((err, questionMaked) => {
        if (err) {
            res.status(500).send({ok: false, message: "Error del servidor"});
        } else {
            if (!questionMaked) {
                res.status(404).send({ok: false, message: "Error al hacer pregunta"});
            } else {
                res.status(200).send({ok: true, message: "Pregunta enviada"});
            }
        }
    });
}

function getQuestions(req, res) {
    Question.find({ active: { $ne: false } }).populate('user', 'name lastname fullName email enterprise position phone').sort({ order: "asc" }).exec((err, questionStored) => {
        if (err) {
            res.status(500).send({ok: false, message: "Error del servidor"});
        } else {
            if (!questionStored) {
                res.status(404).send({ok: false, preguntas: []});
            } else {
                res.status(200).send({ok: true, preguntas: questionStored});
            }
        }
    });
}

function getUserQuestion(req, res) {
    const { id } = req.params;

    Question.findById({ user: id }).populate('user', 'name lastname fullName email enterprise position phone').sort({ order: "asc" }).exec((err, questionStored) => {
        if (err) {
            res.status(500).send({ok: false, message: "Error del servidor"});
        } else {
            if (!questionStored) {
                res.status(404).send({ok: false, preguntas: []});
            } else {
                res.status(200).send({ok: true, preguntas: questionStored});
            }
        }
    });
}

function deleteQuestion(req, res) {
    const { id } = req.params;

    Question.findById({ _id: id }, (err, questionStored) => {
        if (err) {
            res.status(500).send({ ok: false, message: "Error del servidor"});
        } else {
            if (!questionStored) {
                res.status(404).send({ ok: false, message: "Usuario no encontrado"});
            } else {
                questionStored.active = false;
                Question.findByIdAndUpdate({ _id: questionStored.id }, questionStored, (err, questionUpdate) => {
                    if (err) {
                        res.status(500).send({ ok: false, message: "Error del servidor"});
                    } else {
                        if (!questionUpdate) {
                            res.status(404).send({ ok: false, message: "No se ha encontrado la pregunta"});
                        } else {
                            res.status(200).send({
                                ok: true,
                                message: "Pregunta eliminada"
                            });
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    makeQuestion,
    getQuestions,
    getUserQuestion,
    deleteQuestion
}