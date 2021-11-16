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
		if (valEmail != valEmail2) {
			notification["error"]({
				message: "Los correos no son identicos",
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
					{data.fullName ? (
						<div
							className={`${
								!even && lastOdd === "fullName"
									? "odd"
									: "mitad"
							}`}
						>
							<TextField
								id="name"
								type="text"
								name="fullName"
								label="Nombre Completo"
								variant="filled"
								value={inputs.fullName}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.name ? (
						<div
							className={`${
								!even && lastOdd === "name" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="name"
								type="text"
								name="name"
								label="Nombre"
								variant="filled"
								value={inputs.name}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.lastname ? (
						<div
							className={`${
								!even && lastOdd === "lastname"
									? "odd"
									: "mitad"
							}`}
						>
							<TextField
								id="lastname"
								type="text"
								name="lastname"
								label="Apellido"
								variant="filled"
								value={inputs.lastname}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.email ? (
						<>
						<div
							className={`${
								!even && lastOdd === "email" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="email"
								type="email"
								name="email"
								label="Correo"
								variant="filled"
								value={inputs.email}
								onChange={inputValidation}
							/>
						</div>
						<div className={`${!even && lastOdd === "email" ? "odd" : "mitad"}`}>
							<TextField
								id="email2"
								type="email"
								name="email2"
								label="Confirma tu correo"
								variant="filled"
								value={inputs.email2}
								onChange={inputValidation}
							/>
						</div>
						</>
					) : null}
					{data.rut ? (
						<div
							className={`${
								!even && lastOdd === "rut" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="rut"
								type="text"
								name="rut"
								label="Rut"
								variant="filled"
								value={inputs.rut}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.enterprise ? (
						<div
							className={`${
								!even && lastOdd === "enterprise"
									? "odd"
									: "mitad"
							}`}
						>
							<TextField
								id="enterprise"
								type="text"
								name="enterprise"
								label="Empresa"
								variant="filled"
								value={inputs.enterprise}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.position ? (
						<div
							className={`${
								!even && lastOdd === "position"
									? "odd"
									: "mitad"
							}`}
						>
							<TextField
								id="position"
								type="text"
								name="position"
								label="Cargo"
								variant="filled"
								value={inputs.position}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.phone ? (
						<div
							className={`${
								!even && lastOdd === "phone" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="phone"
								type="text"
								name="phone"
								label="Teléfono"
								variant="filled"
								value={inputs.phone}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.country ? (
						<div
							className={`${
								!even && lastOdd === "country" ? "odd" : "mitad"
							}`}
						>
							<Select
								showSearch
								style={{
									width: "100%",
								}}
								placeholder="País"
								optionFilterProp="children"
								onChange={onChangeCountry}
								filterOption={(input, option) =>
									option.children
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
							>
								<Option value="Afganistán">Afganistán</Option>
								<Option value="Albania">Albania</Option>
								<Option value="Alemania">Alemania</Option>
								<Option value="Andorra">Andorra</Option>
								<Option value="Angola">Angola</Option>
								<Option value="Antigua y Barbuda">
									Antigua y Barbuda
								</Option>
								<Option value="Arabia Saudita">
									Arabia Saudita
								</Option>
								<Option value="Argelia">Argelia</Option>
								<Option value="Argentina">Argentina</Option>
								<Option value="Armenia">Armenia</Option>
								<Option value="Australia">Australia</Option>
								<Option value="Austria">Austria</Option>
								<Option value="Azerbaiyán">Azerbaiyán</Option>
								<Option value="Bahamas">Bahamas</Option>
								<Option value="Bangladés">Bangladés</Option>
								<Option value="Barbados">Barbados</Option>
								<Option value="Baréin">Baréin</Option>
								<Option value="Bélgica">Bélgica</Option>
								<Option value="Belice">Belice</Option>
								<Option value="Benín">Benín</Option>
								<Option value="Bielorrusia">Bielorrusia</Option>
								<Option value="Birmania">Birmania</Option>
								<Option value="Bolivia">Bolivia</Option>
								<Option value="Bosnia y Herzegovina">
									Bosnia y Herzegovina
								</Option>
								<Option value="Botsuana">Botsuana</Option>
								<Option value="Brasil">Brasil</Option>
								<Option value="Brunéi">Brunéi</Option>
								<Option value="Bulgaria">Bulgaria</Option>
								<Option value="Burkina Faso">
									Burkina Faso
								</Option>
								<Option value="Burundi">Burundi</Option>
								<Option value="Bután">Bután</Option>
								<Option value="Cabo Verde">Cabo Verde</Option>
								<Option value="Camboya">Camboya</Option>
								<Option value="Camerún">Camerún</Option>
								<Option value="Canadá">Canadá</Option>
								<Option value="Catar">Catar</Option>
								<Option value="Chad">Chad</Option>
								<Option value="Chile">Chile</Option>
								<Option value="China">China</Option>
								<Option value="Chipre">Chipre</Option>
								<Option value="Ciudad del Vaticano">
									Ciudad del Vaticano
								</Option>
								<Option value="Colombia">Colombia</Option>
								<Option value="Comoras">Comoras</Option>
								<Option value="Corea del Norte">
									Corea del Norte
								</Option>
								<Option value="Corea del Sur">
									Corea del Sur
								</Option>
								<Option value="Costa de Marfil">
									Costa de Marfil
								</Option>
								<Option value="Costa Rica">Costa Rica</Option>
								<Option value="Croacia">Croacia</Option>
								<Option value="Cuba">Cuba</Option>
								<Option value="Dinamarca">Dinamarca</Option>
								<Option value="Dominica">Dominica</Option>
								<Option value="Ecuador">Ecuador</Option>
								<Option value="Egipto">Egipto</Option>
								<Option value="El Salvador">El Salvador</Option>
								<Option value="Emiratos Árabes Unidos">
									Emiratos Árabes Unidos
								</Option>
								<Option value="Eritrea">Eritrea</Option>
								<Option value="Eslovaquia">Eslovaquia</Option>
								<Option value="Eslovenia">Eslovenia</Option>
								<Option value="España">España</Option>
								<Option value="Estados Unidos">
									Estados Unidos
								</Option>
								<Option value="Estonia">Estonia</Option>
								<Option value="Etiopía">Etiopía</Option>
								<Option value="Filipinas">Filipinas</Option>
								<Option value="Finlandia">Finlandia</Option>
								<Option value="Fiyi">Fiyi</Option>
								<Option value="Francia">Francia</Option>
								<Option value="Gabón">Gabón</Option>
								<Option value="Gambia">Gambia</Option>
								<Option value="Georgia">Georgia</Option>
								<Option value="Ghana">Ghana</Option>
								<Option value="Granada">Granada</Option>
								<Option value="Grecia">Grecia</Option>
								<Option value="Guatemala">Guatemala</Option>
								<Option value="Guyana">Guyana</Option>
								<Option value="Guinea">Guinea</Option>
								<Option value="Guinea ecuatorial">
									Guinea ecuatorial
								</Option>
								<Option value="Guinea-Bisáu">
									Guinea-Bisáu
								</Option>
								<Option value="Haití">Haití</Option>
								<Option value="Honduras">Honduras</Option>
								<Option value="Hungría">Hungría</Option>
								<Option value="India">India</Option>
								<Option value="Indonesia">Indonesia</Option>
								<Option value="Irak">Irak</Option>
								<Option value="Irán">Irán</Option>
								<Option value="Irlanda">Irlanda</Option>
								<Option value="Islandia">Islandia</Option>
								<Option value="Islas Marshall">
									Islas Marshall
								</Option>
								<Option value="Islas Salomón">
									Islas Salomón
								</Option>
								<Option value="Israel">Israel</Option>
								<Option value="Italia">Italia</Option>
								<Option value="Jamaica">Jamaica</Option>
								<Option value="Japón">Japón</Option>
								<Option value="Jordania">Jordania</Option>
								<Option value="Kazajistán">Kazajistán</Option>
								<Option value="Kenia">Kenia</Option>
								<Option value="Kirguistán">Kirguistán</Option>
								<Option value="Kiribati">Kiribati</Option>
								<Option value="Kuwait">Kuwait</Option>
								<Option value="Laos">Laos</Option>
								<Option value="Lesoto">Lesoto</Option>
								<Option value="Letonia">Letonia</Option>
								<Option value="Líbano">Líbano</Option>
								<Option value="Liberia">Liberia</Option>
								<Option value="Libia">Libia</Option>
								<Option value="Liechtenstein">
									Liechtenstein
								</Option>
								<Option value="Lituania">Lituania</Option>
								<Option value="Luxemburgo">Luxemburgo</Option>
								<Option value="Macedonia del Norte">
									Macedonia del Norte
								</Option>
								<Option value="Madagascar">Madagascar</Option>
								<Option value="Malasia">Malasia</Option>
								<Option value="Malaui">Malaui</Option>
								<Option value="Maldivas">Maldivas</Option>
								<Option value="Malí">Malí</Option>
								<Option value="Malta">Malta</Option>
								<Option value="Marruecos">Marruecos</Option>
								<Option value="Mauricio">Mauricio</Option>
								<Option value="Mauritania">Mauritania</Option>
								<Option value="México">México</Option>
								<Option value="Micronesia">Micronesia</Option>
								<Option value="Moldavia">Moldavia</Option>
								<Option value="Mónaco">Mónaco</Option>
								<Option value="Mongolia">Mongolia</Option>
								<Option value="Montenegro">Montenegro</Option>
								<Option value="Mozambique">Mozambique</Option>
								<Option value="Namibia">Namibia</Option>
								<Option value="Nauru">Nauru</Option>
								<Option value="Nepal">Nepal</Option>
								<Option value="Nicaragua">Nicaragua</Option>
								<Option value="Níger">Níger</Option>
								<Option value="Nigeria">Nigeria</Option>
								<Option value="Noruega">Noruega</Option>
								<Option value="Nueva Zelanda">
									Nueva Zelanda
								</Option>
								<Option value="Omán">Omán</Option>
								<Option value="Países Bajos">
									Países Bajos
								</Option>
								<Option value="Pakistán">Pakistán</Option>
								<Option value="Palaos">Palaos</Option>
								<Option value="Panamá">Panamá</Option>
								<Option value="Papúa Nueva Guinea">
									Papúa Nueva Guinea
								</Option>
								<Option value="Paraguay">Paraguay</Option>
								<Option value="Perú">Perú</Option>
								<Option value="Polonia">Polonia</Option>
								<Option value="Portugal">Portugal</Option>
								<Option value="Reino Unido">Reino Unido</Option>
								<Option value="República Centroafricana">
									República Centroafricana
								</Option>
								<Option value="República Checa">
									República Checa
								</Option>
								<Option value="República del Congo">
									República del Congo
								</Option>
								<Option value="República Democrática del Congo">
									República Democrática del Congo
								</Option>
								<Option value="República Dominicana">
									República Dominicana
								</Option>
								<Option value="Ruanda">Ruanda</Option>
								<Option value="Rumanía">Rumanía</Option>
								<Option value="Rusia">Rusia</Option>
								<Option value="Samoa">Samoa</Option>
								<Option value="San Cristóbal y Nieves">
									San Cristóbal y Nieves
								</Option>
								<Option value="San Marino">San Marino</Option>
								<Option value="San Vicente y las Granadinas">
									San Vicente y las Granadinas
								</Option>
								<Option value="Santa Lucía">Santa Lucía</Option>
								<Option value="Santo Tomé y Príncipe">
									Santo Tomé y Príncipe
								</Option>
								<Option value="Senegal">Senegal</Option>
								<Option value="Serbia">Serbia</Option>
								<Option value="Seychelles">Seychelles</Option>
								<Option value="Sierra Leona">
									Sierra Leona
								</Option>
								<Option value="Singapur">Singapur</Option>
								<Option value="Siria">Siria</Option>
								<Option value="Somalia">Somalia</Option>
								<Option value="Sri Lanka">Sri Lanka</Option>
								<Option value="Suazilandia">Suazilandia</Option>
								<Option value="Sudáfrica">Sudáfrica</Option>
								<Option value="Sudán">Sudán</Option>
								<Option value="Sudán del Sur">
									Sudán del Sur
								</Option>
								<Option value="Suecia">Suecia</Option>
								<Option value="Suiza">Suiza</Option>
								<Option value="Surinam">Surinam</Option>
								<Option value="Tailandia">Tailandia</Option>
								<Option value="Tanzania">Tanzania</Option>
								<Option value="Tayikistán">Tayikistán</Option>
								<Option value="Timor Oriental">
									Timor Oriental
								</Option>
								<Option value="Togo">Togo</Option>
								<Option value="Tonga">Tonga</Option>
								<Option value="Trinidad y Tobago">
									Trinidad y Tobago
								</Option>
								<Option value="Túnez">Túnez</Option>
								<Option value="Turkmenistán">
									Turkmenistán
								</Option>
								<Option value="Turquía">Turquía</Option>
								<Option value="Tuvalu">Tuvalu</Option>
								<Option value="Ucrania">Ucrania</Option>
								<Option value="Uganda">Uganda</Option>
								<Option value="Uruguay">Uruguay</Option>
								<Option value="Uzbekistán">Uzbekistán</Option>
								<Option value="Vanuatu">Vanuatu</Option>
								<Option value="Venezuela">Venezuela</Option>
								<Option value="Vietnam">Vietnam</Option>
								<Option value="Yemen">Yemen</Option>
								<Option value="Yibuti">Yibuti</Option>
								<Option value="Zambia">Zambia</Option>
								<Option value="Zimbabue">Zimbabue</Option>
							</Select>
						</div>
					) : null}
					{data.adress ? (
						<div
							className={`${
								!even && lastOdd === "adress" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="adress"
								type="text"
								name="adress"
								label="Dirección"
								variant="filled"
								value={inputs.adress}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					{data.other ? (
						<div
							className={`${
								!even && lastOdd === "other" ? "odd" : "mitad"
							}`}
						>
							<TextField
								id="otherText"
								type="text"
								name="otherText"
								label={data.otherText}
								variant="filled"
								value={inputs.otherText}
								onChange={inputValidation}
							/>
						</div>
					) : null}
					<div className="odd">
						<ButtonAntd
							htmlType="submit"
							className="btn"
							id="btn"
							style={{
								cursor: "pointer",
								background: `${options.buttonBackground}`,
							}}
						>
							<p>Registrarse</p>
						</ButtonAntd>
					</div>
					{/* <div className="campo">
						<div className="mitad">
							<ColorButton
								variant="contained"
								color="primary"
								className="btn2"
								startIcon={
									<VerticalAlignBottomIcon className="icono" />
								}
								onClick={() => descargar()}
							>
								<a
									style={{
										background: "transparent",
										border: "transparent",
										cursor: "pointer",
										fontWeight: "700",
									}}
								>
									<p>Descargar Agenda</p>{" "}
								</a>
							</ColorButton>
						</div>
					</div> */}
				</Form>
			) : null}
		</>
	);
};

export default RegisterForm;
