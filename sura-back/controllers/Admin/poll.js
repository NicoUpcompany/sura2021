const mongoose = require("mongoose");

const Poll = require("../../models/Admin/poll");
const PollOption = require("../../models/Admin/pollOption");
const PollAnswer = require("../../models/Admin/pollAnswer");

function savePollQuestion(req, res) {
	const poll = new Poll();

	const {
		order,
		question,
		timeStartYear,
		timeStartMonth,
		timeStartDay,
        timeStartHour,
        timeStartMinute,
        timeStartSecond,
		timeEndYear,
        timeEndMonth,
        timeEndDay,
        timeEndHour,
        timeEndMinute,
        timeEndSecond,
		method,
		active,
	} = req.body;

	poll.order = order;
	poll.question = question;
	poll.timeStartYear = timeStartYear;
	poll.timeStartMonth = timeStartMonth;
	poll.timeStartDay = timeStartDay;
	poll.timeStartHour = timeStartHour;
	poll.timeStartMinute = timeStartMinute;
	poll.timeStartSecond = timeStartSecond;
	poll.timeEndYear = timeEndYear;
	poll.timeEndMonth = timeEndMonth;
	poll.timeEndDay = timeEndDay;
	poll.timeEndHour = timeEndHour;
	poll.timeEndMinute = timeEndMinute;
	poll.timeEndSecond = timeEndSecond;
	poll.method = method;
	poll.active = active;
	poll.save((err, pollStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error de servidor" });
		} else {
			if (!pollStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar la pregunta",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Pregunta creada correctamente",
					poll: pollStored,
				});
			}
		}
	});
}

function savePollOption(req, res) {
	const pollOption = new PollOption();

	const { order, option, poll } = req.body;

	pollOption.order = order;
	pollOption.option = option;
	pollOption.poll = poll;
	pollOption.save((err, pollOptionStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error de servidor" });
		} else {
			if (!pollOptionStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar la respuesta",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Respuesta creada correctamente",
					pollOption: pollOptionStored,
				});
			}
		}
	});
}

function savePollAnswer(req, res) {
	const pollAnswer = new PollAnswer();

	const { user, poll, pollOption } = req.body;

	pollAnswer.user = user;
	pollAnswer.poll = poll;
	pollAnswer.pollOption = pollOption;
	pollAnswer.save((err, pollOptionStored) => {
		if (err) {
			res.status(500).send({
				ok: false,
				message: "Error de servidor",
			});
		} else {
			if (!pollOptionStored) {
				res.status(404).send({
					ok: false,
					message: "Error al guardar la respuesta",
				});
			} else {
				res.status(200).send({
					ok: true,
					message: "Respuesta guardada correctamente",
				});
			}
		}
	});
}

function getPollClient(req, res) {
	const { id } = req.params;

	let fullPoll = [];
	let cont = 0;

	PollAnswer.find(
		{ user: mongoose.Types.ObjectId(id) },
		(err, userStored) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error del servidor",
				});
			} else {
				if (userStored.length === 0) {
					Poll.find({ active: { $ne: false } }).then((poll) => {
						if (!poll) {
							res.status(404).send({
								ok: false,
								message: "No se encontró ninguna encuesta",
							});
						} else {
							poll.forEach((item) => {
								PollOption.find(
									{ poll: mongoose.Types.ObjectId(item.id) },
									(err, pollOptionStored) => {
										if (err) {
											res.status(500).send({
												ok: false,
												message: "Error del servidor",
											});
										} else {
											if (pollOptionStored) {
												const data = {
													poll: item,
													options: pollOptionStored,
												};
												fullPoll.push(data);
											}
											cont = cont + 1;
											if ((poll.length = cont)) {
												res.status(200).send({
													ok: true,
													poll: fullPoll,
												});
											}
										}
									}
								);
							});
						}
					});
				} else {
					res.status(200).send({
						ok: false,
						message: "Ya has votado",
					});
				}
			}
		}
	);
}

function getPoll(req, res) {
	const params = req.params;

	let fullPoll = [];
	let cont = 0;

	PollAnswer.find({user: mongoose.Types.ObjectId(params.id)})
		.then((pollAnswers) => {
			if (pollAnswers.length === 0) {
				Poll.find({}).sort({ order: "asc" }).then((poll) => {
					if (poll.length === 0) {
						res.status(404).send({
							ok: false,
							message: "No se encontró ninguna encuesta",
						});
					} else {
						let length = poll.length;
						poll.forEach((item) => {
							PollOption.find(
								{ poll: mongoose.Types.ObjectId(item.id) },
								(err, pollOptionStored) => {
									if (err) {
										res.status(500).send({
											ok: false,
											message: "Error del servidor",
										});
									} else {
										if (pollOptionStored) {
											const data = {
												poll: item,
												options: pollOptionStored,
											};
											fullPoll.push(data);
										}
										length = length - 1;
										if (length === 0) {
											res.status(200).send({
												ok: true,
												poll: fullPoll,
											});
										}
									}
								}
							);
						});
					}
				});
			} else {
				Poll.find().sort({ order: "asc" }).then((poll) => {
					if (poll.length === 0) {
						res.status(404).send({
							ok: false,
							message: "No se encontró ninguna encuesta",
						});
					} else {
						const pollAnswersArray = [];
						pollAnswers.forEach(element => {
							pollAnswersArray.push(element.poll.toString());
						});
						let length = poll.length;
						poll.forEach((item) => {
							const pollId = item._id.toString();
							if (!pollAnswersArray.includes(pollId)) {
								PollOption.find(
									{ poll: mongoose.Types.ObjectId(item.id) },
									(err, pollOptionStored) => {
										if (err) {
											res.status(500).send({
												ok: false,
												message: "Error del servidor",
											});
										} else {
											if (pollOptionStored) {
												const data = {
													poll: item,
													options: pollOptionStored,
												};
												fullPoll.push(data);
											}
											length = length - 1;
											if (length === 0) {
												res.status(200).send({
													ok: true,
													poll: fullPoll,
												});
											}
										}
									}
								);
							} else {
								length = length - 1;
								if (length === 0) {
									res.status(200).send({
										ok: true,
										poll: fullPoll,
									});
								}
							}
						});
					}
				});
			}
		});

	
}

function getQuestion(req, res) {
	Poll.find({}).then((poll) => {
        if (poll.length === 0) {
            res.status(404).send({
				ok: false,
				message: "No se encontró ninguna pregunta",
			});
        } else {
            res.status(200).send({ ok: true, poll });
        }
	});
}

function getOptions(req, res) {
	const params = req.params;

	PollOption.find({poll: mongoose.Types.ObjectId(params.id)})
		.then((pollOptions) => {
			if (pollOptions.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ninguna opción",
				});
			} else {
				res.status(404).send({ ok: true, options: pollOptions });
			}
		});
}

function getPollAdmin(req, res) {
	let fullPoll = [];

	Poll.find({}).sort({ order: "asc" }).then((poll) => {
		if (poll.length === 0) {
			res.status(404).send({
				ok: false,
				message: "No se encontró ninguna encuesta",
			});
		} else {
			let length = poll.length;
			poll.forEach((item) => {
				PollOption.find(
					{ poll: mongoose.Types.ObjectId(item.id) },
					(err, pollOptionStored) => {
						if (err) {
							res.status(500).send({
								ok: false,
								message: "Error del servidor",
							});
						} else {
							if (pollOptionStored) {
								const data = {
									poll: item,
									options: pollOptionStored,
								};
								fullPoll.push(data);
							}
							length = length - 1;
							if (length === 0) {
								res.status(200).send({
									ok: true,
									poll: fullPoll,
								});
							}
						}
					}
				);
			});
		}
	});
}

function getAnswer(req, res) {
	PollAnswer.find({})
		.populate({ path: "pollOption", populate: { path: "poll" } })
		.populate('user', 'name lastname fullName email enterprise position phone')
		.then((pollAnswers) => {
			if (pollAnswers.length === 0) {
				res.status(404).send({
					ok: false,
					message: "No se encontró ninguna respuesta",
				});
			} else {
				res.status(200).send({ ok: true, answers: pollAnswers });
			}
		});
}

function updateQuestion(req, res) {
	let questionData = req.body;
	const params = req.params;

	Poll.findByIdAndUpdate(
		{ _id: params.id },
		questionData,
		(err, questionUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!questionUpdate) {
					res.status(404).send({
						ok: false,
						message: "No se ha encontrado la pregunta",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Pregunta actualizada",
					});
				}
			}
		}
	);
}

function updateOption(req, res) {
	let optionData = req.body;
	const params = req.params;

	PollOption.findByIdAndUpdate(
		{ _id: params.id },
		optionData,
		(err, optionUpdate) => {
			if (err) {
				res.status(500).send({
					ok: false,
					message: "Error de servidor",
				});
			} else {
				if (!optionUpdate) {
					res.status(404).send({
						ok: false,
						message: "No se ha encontrado la opción",
					});
				} else {
					res.status(200).send({
						ok: true,
						message: "Opción actualizada",
					});
				}
			}
		}
	);
}

function deleteQuestion(req, res) {
	const { id } = req.params;

	Poll.findByIdAndRemove(id, (err, pollDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!pollDeleted) {
				res.status(404).send({
					ok: false,
					message: "Pregunta no encontrada",
				});
			} else {
				res.status(200).send({ ok: true, message: "Pregunta eliminada" });
			}
		}
	});
}

function deleteOption(req, res) {
	const { id } = req.params;

	PollOption.findByIdAndRemove(id, (err, pollOptionDeleted) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!pollOptionDeleted) {
				res.status(404).send({
					ok: false,
					message: "Alternativa no encontrada",
				});
			} else {
				res.status(200).send({ ok: true, message: "Alternativa eliminada" });
			}
		}
	});
}

module.exports = {
	savePollQuestion,
	savePollOption,
	savePollAnswer,
	getPollClient,
	getPoll,
	getQuestion,
	getOptions,
	getPollAdmin,
	getAnswer,
	updateQuestion,
	updateOption,
	deleteQuestion,
	deleteOption,
};
