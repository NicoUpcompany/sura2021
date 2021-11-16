require("dotenv").config();
const nodemailer = require("nodemailer");
const moment = require("moment");
require("moment/locale/es");

const jwt = require("../services/jwt");
const User = require("../models/user");
const Accreditation = require("../models/Admin/accreditation");

const upEmail = process.env.EMAIL;
const upPassword = process.env.PASSWORD_EMAIL;

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: upEmail,
		pass: upPassword,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

function signUp(req, res) {
	const user = new User();

	const { fullName, name, lastname, email, rut, enterprise, position, phone, country, adress, other } = req.body;

	Accreditation.find().then((accreditation) => {
		if (accreditation.length === 0) {
			res.status(404).send({
				ok: false,
				message: "Aún no se ha subido los ajustes de acreditación",
			});
		} else {
			const verifyAccreditation = accreditation[0];
			if (verifyAccreditation.fullName) {
				user.fullName = fullName;
			}
			if (verifyAccreditation.name) {
				user.name = name;
			}
			if (verifyAccreditation.lastname) {
				user.lastname = lastname;
			}
			if (verifyAccreditation.email) {
				user.email = email.toString().toLowerCase();
			}
			if (verifyAccreditation.rut) {
				user.rut = rut;
			}
			if (verifyAccreditation.enterprise) {
				user.enterprise = enterprise;
			}
			if (verifyAccreditation.position) {
				user.position = position;
			}
			if (verifyAccreditation.phone) {
				user.phone = phone;
			}
			if (verifyAccreditation.country) {
				user.country = country;
			}
			if (verifyAccreditation.adress) {
				user.adress = adress;
			}
			if (verifyAccreditation.other) {
				user.other = other;
			}

			user.signUpTime = moment().subtract(4, "hours").format("LLL");

			user.save((err, userStored) => {
				if (err) {
					res.status(500).send({
						ok: false,
						message: "El usuario ya existe",
					});
				} else {
					if (!userStored) {
						res.status(404).send({
							ok: false,
							message: "Error al crear el usuario",
						});
					} else {
						if (verifyAccreditation.email) {
							const mailOptions = {
								from: `${verifyAccreditation.from} <${upEmail}>`,
								to: userStored.email,
								subject: verifyAccreditation.subject,
								text: verifyAccreditation.subject,
								html: verifyAccreditation.html,
							};
							transporter.sendMail(mailOptions, function (error, info) {
								if (error) {
									res.status(500).send({
										ok: false,
										message: "Error del servidor",
									});
								} else {
									res.status(200).send({
										ok: true,
										message: "Usuario creado",
										userId: userStored.id,
									});
								}
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario creado",
								userId: userStored.id,
							});
						}
					}
				}
			});
		}
	});
}

 function signIn(req, res) {
	const user = new User();
	let { email } = req.body;

	console.log(user)

	// user.email = email.toString().toLowerCase();

	email = email.toString().toLowerCase();

	const signInTime = moment().subtract(4, "hours").format("LLL");

	 User.findOne({ email }, (err, userStored) => {
		console.log(userStored)
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({ok:false, message: "Usuario no encontrado"});
				// console.log('entro')
				// user.signInTime = signInTime;
				// user.signUpTime = signInTime;
				// user.save((err, userAuxStored) => {
				// 	if (err) {
				// 		res.status(500).send({ ok: false, message: "Error del servidor" });
				// 	} else {
				// 		if (!userAuxStored) {
				// 			res.status(404).send({
				// 				ok: false,
				// 				message: "Error al guardar el usuario",
				// 			});
				// 		} else {
				// 			res.status(200).send({
				// 				ok: true,
				// 				accessToken: jwt.createAccessToken(userAuxStored),
				// 				refreshToken: jwt.createRefreshToken(userAuxStored),
				// 			});
				// 		}
				// 	}
				// });
			} else {
				// console.log('entro 2')
				if (!userStored.active) {
					res.status(403).send({
						ok: false,
						message: "Ingreso no permitido",
					});
				} else {
					userStored.signInTime = signInTime;
					User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
						if (err) {
							res.status(500).send({
								ok: false,
								message: "Error del servidor",
							});
						} else {
							if (!userUpdate) {
								res.status(404).send({
									ok: false,
									message: "No se ha encontrado el usuario",
								});
							} else {
								res.status(200).send({
									ok: true,
									accessToken: jwt.createAccessToken(userUpdate),
									refreshToken: jwt.createRefreshToken(userUpdate),
								});
							}
						}
					});
				}
			}
		}
	});
}

function signInAdmin(req, res) {
	const { email } = req.body;

	const signInTime = moment().subtract(4, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				if (userStored.role !== "Admin") {
					res.status(403).send({
						ok: false,
						message: "No eres administrador",
					});
				} else {
					userStored.signInTime = signInTime;
					User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
						if (err) {
							res.status(500).send({
								ok: false,
								message: "Error del servidor",
							});
						} else {
							if (!userUpdate) {
								res.status(404).send({
									ok: false,
									message: "No se ha encontrado el usuario",
								});
							} else {
								res.status(200).send({
									ok: true,
									accessToken: jwt.createAccessToken(userStored),
									refreshToken: jwt.createRefreshToken(userStored),
								});
							}
						}
					});
				}
			}
		}
	});
}

function getUsers(req, res) {
	User.find({ active: { $ne: false } }).then((users) => {
		if (!users) {
			res.status(404).send({
				ok: false,
				message: "No se ha encontrado ningún usuario",
			});
		} else {
			res.status(200).send({ ok: true, users });
		}
	});
}

function updateWaitingRoomTime(req, res) {
	const { email } = req.body;

	const waitingRoomTime = moment().subtract(4, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				userStored.waitingRoomTime = waitingRoomTime;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!userUpdate) {
							res.status(404).send({
								ok: false,
								message: "No se ha encontrado el usuario",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function updateStreamTime(req, res) {
	const { email } = req.body;

	const streamTime = moment().subtract(4, "hours").format("LLL");

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				userStored.streamTime = streamTime;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!userUpdate) {
							res.status(404).send({
								ok: false,
								message: "No se ha encontrado el usuario",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function changeRole(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				if (userStored.role === "Admin") {
					userStored.role = "User";
				} else {
					userStored.role = "Admin";
				}
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!userUpdate) {
							res.status(404).send({
								ok: false,
								message: "No se ha encontrado el usuario",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario actualizado",
							});
						}
					}
				});
			}
		}
	});
}

function updateUser(req, res) {
	let userData = req.body;
	const params = req.params;

	User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
		if (err) {
			res.status(500).send({ message: "Error del servidor" });
		} else {
			if (!userUpdate) {
				res.status(404).send({
					message: "No se ha encontrado el usuario",
				});
			} else {
				res.status(200).send({ message: "Usuario actualizado" });
			}
		}
	});
}

function deleteUser(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				userStored.active = false;
				User.findByIdAndUpdate({ _id: userStored.id }, userStored, (err, userUpdate) => {
					if (err) {
						res.status(500).send({
							ok: false,
							message: "Error del servidor",
						});
					} else {
						if (!userUpdate) {
							res.status(404).send({
								ok: false,
								message: "No se ha encontrado el usuario",
							});
						} else {
							res.status(200).send({
								ok: true,
								message: "Usuario eliminado",
							});
						}
					}
				});
			}
		}
	});
}

function searchById(req, res) {
	const { id } = req.params;

	User.findById({ _id: id }, (err, userStored) => {
		if (err) {
			res.status(500).send({ ok: false, message: "Error del servidor" });
		} else {
			if (!userStored) {
				res.status(404).send({
					ok: false,
					message: "Usuario no encontrado",
				});
			} else {
				res.status(200).send({
					ok: true,
					user: userStored,
				});
			}
		}
	});
}

module.exports = {
	signUp,
	signIn,
	signInAdmin,
	getUsers,
	updateWaitingRoomTime,
	updateStreamTime,
	changeRole,
	updateUser,
	deleteUser,
	searchById,
};
