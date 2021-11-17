/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { notification, Form, Button as ButtonAntd, Select } from "antd";
import TextField from "@material-ui/core/TextField";

import { signUpApi } from "../../../api/user";
import { getAccreditationApi } from "../../../api/Admin/accreditation";
import {
	emailValidation,
	minLengthValidation,
	rutValidation,
} from "../../../utils/formValidation";

import "./RegisterForm.scss";

const { Option } = Select;

const RegisterForm = (props) => {
	const [inputs, setInputs] = useState({
		email: "",
		email2: "",
		fullName: "",
		name: "",
		lastname: "",
		rut: "",
		enterprise: "",
		position: "",
		phone: "",
		country: "",
		adress: "",
		otherText: "",
	});
	const [formValid, setFormValid] = useState({
		email: false,
		email2: false,
		fullName: false,
		name: false,
		lastname: false,
		rut: false,
		enterprise: false,
		position: false,
		phone: false,
		country: false,
		adress: false,
		otherText: false,
	});
	const [even, setEven] = useState(false);
	const [lastOdd, setLastOdd] = useState("");
	const [stateForm, setStateForm] = useState(false);
	const [data, setData] = useState({
		email: true,
		email2: false,
		fullName: false,
		name: false,
		lastname: false,
		rut: false,
		enterprise: false,
		position: false,
		phone: false,
		country: false,
		adress: false,
		other: false,
		otherText: "",
	});
	const { setLoading, setSaveData, options } = props;

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);
		const resp = await getAccreditationApi();
		if (!resp.ok) {
			setStateForm(false);
			setLoading(false);
		} else {
			const accreditation = resp.acreditacion;
			setData({
				email: accreditation.email,
				email2: accreditation.email2,
				fullName: accreditation.fullName,
				name: accreditation.name,
				lastname: accreditation.lastname,
				rut: accreditation.rut,
				enterprise: accreditation.enterprise,
				position: accreditation.position,
				phone: accreditation.phone,
				country: accreditation.country,
				adress: accreditation.adress,
				other: accreditation.other,
				otherText: accreditation.otherText,
			});
			let countAux = 0;
			if (accreditation.email) {
				countAux = countAux + 1;
				setLastOdd("email");
			}
			if (accreditation.email) {
				countAux = countAux + 1;
				setLastOdd("email2");
			}
			if (accreditation.fullName) {
				countAux = countAux + 1;
				setLastOdd("fullName");
			}
			if (accreditation.name) {
				countAux = countAux + 1;
				setLastOdd("name");
			}
			if (accreditation.lastname) {
				countAux = countAux + 1;
				setLastOdd("lastname");
			}
			if (accreditation.rut) {
				countAux = countAux + 1;
				setLastOdd("rut");
			}
			if (accreditation.enterprise) {
				countAux = countAux + 1;
				setLastOdd("enterprise");
			}
			if (accreditation.position) {
				countAux = countAux + 1;
				setLastOdd("position");
			}
			if (accreditation.phone) {
				countAux = countAux + 1;
				setLastOdd("phone");
			}
			if (accreditation.country) {
				countAux = countAux + 1;
				setLastOdd("country");
			}
			if (accreditation.adress) {
				countAux = countAux + 1;
				setLastOdd("adress");
			}
			if (accreditation.other) {
				countAux = countAux + 1;
				setLastOdd("other");
			}
			if (countAux % 2 === 0) {
				setEven(true);
			} else {
				setEven(false);
			}
			setStateForm(true);
			setLoading(false);
		}
	};

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const inputValidation = async (e) => {
		const { type, name } = e.target;

		if (type === "email") {
			setFormValid({
				...formValid,
				[name]: emailValidation(e.target),
			});
		}
		if (type === "text") {
			if (name === "rut") {
				setFormValid({
					...formValid,
					[name]: rutValidation(e.target),
				});
			} else {
				setFormValid({
					...formValid,
					[name]: minLengthValidation(e.target, 2),
				});
			}
		}
	};

	const SignUp = async () => {
		setLoading(true);
		let statusFunction = true;
		let valFullName;
		let fullNameValid;
		let valName;
		let nameValid;
		let valLastName;
		let lastNameValid;
		let valRut;
		let rutValid;
		let valEnterprise;
		let enterpriseValid;
		let valPosition;
		let positionValid;
		let valPhone;
		let phoneValid;
		let valCountry;
		let countryValid;
		let valAdress;
		let adressValid;
		let valOtherText;
		let otherTextValid;
		if (data.fullName) {
			valFullName = inputs.fullName;
			fullNameValid = formValid.fullName;
			if (!fullNameValid) {
				notification["error"]({
					message: "Ingrese un nombre completo válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valFullName) {
				notification["error"]({
					message: "Nombre completo es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.name) {
			valName = inputs.name;
			nameValid = formValid.name;
			if (!nameValid) {
				notification["error"]({
					message: "Ingrese un nombre válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valName) {
				notification["error"]({
					message: "Nombre es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.lastname) {
			valLastName = inputs.lastname;
			lastNameValid = formValid.lastname;
			if (!lastNameValid) {
				notification["error"]({
					message: "Ingrese un apellido válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valLastName) {
				notification["error"]({
					message: "Apellido es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.rut) {
			valRut = inputs.rut;
			rutValid = formValid.rut;
			if (!rutValid) {
				notification["error"]({
					message: "Ingrese un rut válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valRut) {
				notification["error"]({
					message: "Rut es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.enterprise) {
			valEnterprise = inputs.enterprise;
			enterpriseValid = formValid.enterprise;
			if (!enterpriseValid) {
				notification["error"]({
					message: "Ingrese una empresa válida",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valEnterprise) {
				notification["error"]({
					message: "Empresa es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.position) {
			valPosition = inputs.position;
			positionValid = formValid.position;
			if (!positionValid) {
				notification["error"]({
					message: "Ingrese un cargo válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valPosition) {
				notification["error"]({
					message: "Cargo es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.phone) {
			valPhone = inputs.phone;
			phoneValid = formValid.phone;
			if (!phoneValid) {
				notification["error"]({
					message: "Ingrese un teléfono válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valPhone) {
				notification["error"]({
					message: "Teléfono es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.country) {
			valCountry = inputs.country;
			countryValid = true;
			if (!countryValid) {
				notification["error"]({
					message: "Ingrese un país válido",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valCountry) {
				notification["error"]({
					message: "País es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.adress) {
			valAdress = inputs.adress;
			adressValid = formValid.adress;
			if (!adressValid) {
				notification["error"]({
					message: "Ingrese una dirección válida",
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valAdress) {
				notification["error"]({
					message: "Dirección es un campo obligatorio",
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		if (data.other) {
			valOtherText = inputs.otherText;
			otherTextValid = formValid.otherText;
			if (!otherTextValid) {
				notification["error"]({
					message: `El campo ${data.otherText} no es válido`,
				});
				setLoading(false);
				statusFunction = false;
			}
			if (!valOtherText) {
				notification["error"]({
					message: `${data.otherText} es un campo obligatorio`,
				});
				setLoading(false);
				statusFunction = false;
			}
		}
		const valEmail 	= inputs.email;
		const valEmail2 = inputs.email2;
		const emailValid = formValid.email;
		if (!emailValid) {
			notification["error"]({
				message: "Ingrese un correo válido",
			});
			setLoading(false);
			statusFunction = false;
		}
		if (!valEmail) {
			notification["error"]({
				message: "Correo es un campo obligatorio",
			});
			setLoading(false);
			statusFunction = false;
		}
		if (statusFunction) {
			const result = await signUpApi(inputs);
			if (!result.ok) {
				notification["error"]({
					message: result.message,
				});
				setLoading(false);
			} else {
				localStorage.setItem("userID", result.userId);
				setLoading(false);
				setSaveData(2);
			}
		}
	};

	// const descargar = () => {
	// 	setSaveData(3);
	// 	window.open(agenda, "_blank");
	// };

	function onChangeCountry(value) {
		setInputs({
			...inputs,
			country: value,
		});
	}

	return (
		<>

			{stateForm ? (
				<Form onChange={changeForm} onFinish={SignUp}>
					<div className="campo">
						<div className="m">
							<input
								id="name"
								type="text"
								name="name"
								placeholder="Nombre"
								variant="filled"
								value={inputs.name}
								onChange={inputValidation}
							/>
						</div>
						<div className="m">
							<input
								id="lastname"
								type="text"
								name="lastname"
								placeholder="Apellido"
								variant="filled"
								value={inputs.lastname}
								onChange={inputValidation}
							/>
						</div>
					</div>

					<div className="campo">
						<div className="m">
							<input
								id="email"
								type="email"
								name="email"
								placeholder="Mail"
								variant="filled"
								value={inputs.email}
								onChange={inputValidation}
							/>
						</div>
						<div className="m tel">
							<span>+56</span>
							<input
								id="phone"
								type="text"
								name="phone"
								placeholder="Teléfono"
								variant="filled"
								value={inputs.phone}
								onChange={inputValidation}
							/>
						</div>
					</div>

					<div className="campo">
						<div className="m">
							<input
								id="enterprise"
								type="text"
								name="enterprise"
								placeholder="Empresa/Institución"
								variant="filled"
								value={inputs.enterprise}
								onChange={inputValidation}
							/>
						</div>
						<div className="m">
							<input
								id="position"
								type="text"
								name="position"
								placeholder="Cargo/Puesto"
								variant="filled"
								value={inputs.position}
								onChange={inputValidation}
							/>
						</div>
					</div>

					<div className="campo">
						<ButtonAntd
							htmlType="submit"
							className="btn"
							id="btn"
						>
							<p>Registrarse</p>
						</ButtonAntd>
					</div>
				</Form>
			) : null}
		</>
	);
};

export default RegisterForm;
