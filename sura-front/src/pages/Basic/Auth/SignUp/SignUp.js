/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

import RegisterForm from "../../../../components/Basic/RegisterForm/RegisterForm";
import { eventApi } from "../../../../api/events";
import { getSignUpApi, getSignUpImageApi } from "../../../../api/Admin/signUp";
import { getEventOptionsApi } from "../../../../api/Admin/eventOptions";
import { getAccessTokenApi } from "../../../../api/auth";
import Socket from "../../../../utils/socket";

 
import "./SignUp.scss";

const SignUp = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [saveData, setSaveData] = useState(0);
	const [image, setImage] = useState("");
	const [indexStatus, setIndexStatus] = useState(false);
	const [options, setOptions] = useState({
		title: "",
		description: "",
		image: "",
		buttonBackground: "default",
		buttonBackgroundHover: "default",
		titlesColors: "default",
		textsColors: "default",
	});

	useEffect(() => {
		getData();
		getIndex();
		const token = getAccessTokenApi();
		if (token !== null) {
			const decodedToken = jwtDecode(token);
			if (decodedToken) {
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
			}
		}
	}, []);

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Link";
				description = "Ya estoy registrado";
				break;
			case 2:
				action = "Boton";
				description = "Registrar";
				break;
			case 3:
				action = "Boton";
				description = "Descargar Agenda";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/registro",
			stand: "",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 1) {
			history.push("/");
		}
		if (saveData === 2) {
			history.push("/confirmacion");
		}
	}, [saveData]);

	const getData = async () => {
		const resp = await getSignUpApi();
		if (resp.ok) {
			setOptions({
				...options,
				title: resp.signUp.title,
				description: resp.signUp.description,
				buttonBackground: resp.signUp.buttonBackground,
				buttonBackgroundHover: resp.signUp.buttonBackgroundHover,
				titlesColors: resp.signUp.titlesColors,
				textsColors: resp.signUp.textsColors,
			});
			if (resp.signUp.image.length > 0) {
				const result = await getSignUpImageApi(resp.signUp.image);
				setImage(result);
			}
			var css = `
				.btn:hover {
					background-color: ${resp.signUp.buttonBackgroundHover} !important;
				}
				.ant-select-show-search .ant-select:not(.ant-select-customize-input)
					.ant-select-selector {
					border-bottom: 1px solid ${resp.signUp.buttonBackground} !important;
				}
				.MuiFilledInput-underline:hover:before {
					border-bottom: 1px solid ${resp.signUp.buttonBackground} !important;
				}
				.MuiFilledInput-underline:focus:before {
					border-bottom: 1px solid ${resp.signUp.buttonBackground} !important;
				}
				.MuiFilledInput-underline:before {
					border-bottom: 1px solid ${resp.signUp.buttonBackground} !important;
				}
				.MuiFormLabel-root.Mui-focused {
					color: ${resp.signUp.buttonBackgroundHover} !important;
				}
				.MuiFilledInput-underline:after {
					border-bottom: 1px solid ${resp.signUp.buttonBackgroundHover} !important;
				}
				.col4 a {
					color: ${resp.signUp.textsColors} !important;
				}
			`;
			var style = document.createElement("style");

			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			document.getElementsByTagName("head")[0].appendChild(style);
		}
	};

	const getIndex = async () => {
		const resp = await getEventOptionsApi();
		if (resp.ok) {
			if (
				window.location.pathname === "/" &&
				resp.optionsEvent.index === "signUp"
			) {
				setIndexStatus(true);
			} else {
				if (window.location.pathname === "/registro") {
					setIndexStatus(false);
				} else {
					history.push("/iniciarsesion");
				}
			}
		}
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin
			spinning={loading}
			size="large"
			tip="Cargando..."
			indicator={antIcon}
		>
			<div className="fondo">
				<div className="row">
					<div className="col3">
						<img src={image} alt="fondo" />
					</div>
					<div className="col4">
						<div
							dangerouslySetInnerHTML={{
								__html: options.title,
							}}
						/>
						{/* <h2 style={{ color: options.titlesColors }}>
							{options.title}
						</h2>
						<p
							style={{
								color: options.textsColors,
								marginBottom: "0px",
							}}
						>
							<strong>
								GoDigital: Cambiando la manera de interactuar
							</strong>
						</p>
						<p style={{ color: options.textsColors }}>
							En la actualidad, las expectativas de los clientes
							son cada vez más altas. En GoDigital exploraremos
							cómo grandes empresas han implementado soluciones
							con Inteligencia Artificial para potenciar la
							atención que brindan en todos sus canales digitales.
						</p> */}
						<RegisterForm
							setSaveData={setSaveData}
							setLoading={setLoading}
							options={options}
						/>
						{indexStatus ? null : (
							<a onClick={() => setSaveData(1)}>
								Ya estoy registrado
							</a>
						)}
					</div>
				</div>
			</div>
			{/*
			<div className="agenda-container">
				<div className="section-2">
					<div className="exponentes">
						<h3>Oradores</h3>
						<div className="description grey">
							<div className="icon rocioCossini"></div>
							<div className="nombrecolaborador">
								<span>
									<strong>Rocío Cossini</strong>
								</span>
								<br />
								<span>
									Gerente Comercial Chile, Perú y Ecuador
								</span>
								<br />
								<span className="ultimo">
									<strong>Presentadora</strong>
								</span>
							</div>
						</div>
						<div className="description">
							<div className="icon pabloGonzalia"></div>
							<div className="nombrecolaborador">
								<span>
									<strong>Pablo Gonzalía</strong>
								</span>
								<br />
								<span>Gerente General Émerix Chile</span>
								<br />
								<span className="ultimo">
									<strong>
										Posee estudios en Ingeniería en sistemas
										de Información por la Universidad
										Tecnológica Nacional (UTN) y es
										especialista en Gerenciamiento de
										Proyectos. Tiene más de 15 años de
										experiencia en Proyectos de
										implementación de Sistemas de
										Información para el mercado financiero
										con foco en la Gestión de Carteras de
										Clientes y Recupero, tanto en Argentina
										como en Latinoamérica.
									</strong>
								</span>
							</div>
						</div>
						<div className="description grey">
							<div className="icon antonioCastillo"></div>
							<div className="nombrecolaborador">
								<span>
									<strong>Antonio Castillo</strong>
								</span>
								<br />
								<span>Gerente General Émerix México</span>
								<br />
								<span className="ultimo">
									<strong>
										Ingeniero en Electrónica y
										Comunicaciones de la Escuela Superior de
										Ingeniería Mecánica y Eléctrica. Tiene
										más de 25 años de experiencia en la
										Industria de la Tecnología de
										Información. Ha participado en diversos
										proyectos de automatización de cobranza
										de carteras de crédito para bancos,
										financieras, empresas de servicios y
										retailers en Latinoamérica.
									</strong>
								</span>
							</div>
						</div>
						<div className="description">
							<div className="icon enriqueAlvarez"></div>
							<div className="nombrecolaborador">
								<span>
									<strong>Enrique Álvarez</strong>
								</span>
								<br />
								<span>Solutions Consultant en Cognitiva</span>
								<br />
								<span className="ultimo">
									<strong>
										Ingeniero Comercial Master en Business
										Intelligence Universidad de
										Barcelona-OBS; Advanced Management
										Program IESE-ESE Business School;
										Programa de Alta Dirección de Riesgo
										Instituto de Empresas Business School de
										Madrid. Posee +20 años de experiencia en
										la industria financiera y servicios,
										liderando áreas de Riesgos, Cobranzas y
										Análisis.
									</strong>
								</span>
							</div>
						</div>
						<img
							src={footerRegistro}
							alt="footerRegistro"
							className="footerRegistro"
						/>
					</div>
				</div>
			</div>
		*/}
			{/* <footer className="footer-sign-up">
				<img className="logo" src={logo} alt="logo" />
				<a
					onClick={() =>
						window.open("https://www.upwebinar.cl/", "_blank")
					}
				>
					Powered By
					<img src={up} alt="logo2" />
				</a>
			</footer> */}
		</Spin>
	);
};

export default SignUp;
