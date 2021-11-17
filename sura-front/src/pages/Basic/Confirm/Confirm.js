/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import AppleIcon from "@material-ui/icons/Apple";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import moment from "moment";
import momentTimezone from "moment-timezone";
import "moment/locale/es";

import { eventApi } from "../../../api/events";
import { getAccessTokenApi } from "../../../api/auth";
import { getChronometerApi } from "../../../api/Admin/chronometer";
import { getEventOptionsApi } from "../../../api/Admin/eventOptions";
import { getConfirmApi } from "../../../api/Admin/confirm";
import Socket from "../../../utils/socket";
import logo from "../../../assets/images/logo.svg";

import "./Confirm.scss";

const Confirmacion = () => {
	const history = useHistory();

	const [saveData, setSaveData] = useState(0);
	const [title, setTitle] = useState("");
	const [fullDate, setFullDate] = useState("");
	const [fullEndDate, setFullEndDate] = useState("");
	const [date, setDate] = useState("");
	const [hour, setHour] = useState("");
	const [url, setUrl] = useState("");
	const [, setLogo] = useState("");
	const [indexStatus, setIndexStatus] = useState(false);
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState({
		text: "",
		logo: "",
		background: "#0000a2",
		buttonBackground:"#0000a2",
		buttonBackgroundHover: "#0000a2",
		titlesColors: "default",
		textsColors: "default",
		icons: "default",
	});

	useEffect(() => {
		getData();
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
				action = "Boton";
				description = "Agregar a mi calendario";
				break;
			case 2:
				action = "Boton";
				description = "Apple Calendar";
				break;
			case 3:
				action = "Boton";
				description = "Google Calendar";
				break;
			case 4:
				action = "Boton";
				description = "Outlook";
				break;
			case 5:
				action = "Boton";
				description = "Iniciar sesión";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/confirmacion",
			stand: "",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 5) {
			history.push("/iniciarsesion");
		}
	}, [saveData]);

	const abrirOutlook = (calendario) => {
		if (calendario === "Apple") {
			setSaveData(2);
		} else {
			setSaveData(4);
		}
		const d1 = new Date(fullDate);
		const d2 = new Date(fullEndDate);

		let d1_str, d2_str;

		const d1_y = d1.getFullYear();
		const d1_m = ("0" + (d1.getMonth() + 1)).slice(-2);
		const d1_d = ("0" + d1.getDate()).slice(-2);
		const d1_hh = ("0" + d1.getHours()).slice(-2);
		const d1_mm = ("0" + d1.getMinutes()).slice(-2);

		const d2_y = d2.getFullYear();
		const d2_m = ("0" + (d2.getMonth() + 1)).slice(-2);
		const d2_d = ("0" + d2.getDate()).slice(-2);
		const d2_hh = ("0" + d2.getHours()).slice(-2);
		const d2_mm = ("0" + d2.getMinutes()).slice(-2);

		d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
		d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";
		const newEvent = {
			BEGIN: "VCALENDAR",
			PRODID: `${window.location.protocol}//${window.location.hostname}`,
			UID: `${window.location.protocol}//${window.location.hostname}`,
			DTSTART: d1_str,
			DTEND: d2_str,
			SUMMARY: title,
			DESCRIPTION: title,
			END: "VCALENDAR",
		};
		let formattedDate = formatDate(newEvent.DTSTART);
		let formattedEndDate = formatDate(newEvent.DTEND);
		// eslint-disable-next-line no-undef
		let cal = ics();
		cal.addEvent(
			newEvent.SUMMARY,
			newEvent.DESCRIPTION,
			newEvent.PRODID,
			formattedDate,
			formattedEndDate
		);

		cal.download(title);
		// const url =
		// 	"https://upwebinar.cl/mailing/cognitiva/CognitiveContact.ics";
		// window.open(url, "_blank");
	};

	const abrirGoogleCalendar = () => {
		setSaveData(3);
		let str_api,
			str_location,
			str_start,
			str_end,
			str_title,
			str_details,
			extras;

		const d1 = new Date(fullDate);
		const d2 = new Date(fullEndDate);

		let d1_str, d2_str;

		const d1_y = d1.getFullYear();
		const d1_m = ("0" + (d1.getMonth() + 1)).slice(-2);
		const d1_d = ("0" + d1.getDate()).slice(-2);
		const d1_hh = ("0" + d1.getHours()).slice(-2);
		const d1_mm = ("0" + d1.getMinutes()).slice(-2);

		const d2_y = d2.getFullYear();
		const d2_m = ("0" + (d2.getMonth() + 1)).slice(-2);
		const d2_d = ("0" + d2.getDate()).slice(-2);
		const d2_hh = ("0" + d2.getHours()).slice(-2);
		const d2_mm = ("0" + d2.getMinutes()).slice(-2);

		d1_str = d1_y + d1_m + d1_d + "T" + d1_hh + d1_mm + "00";
		d2_str = d2_y + d2_m + d2_d + "T" + d2_hh + d2_mm + "00";

		str_api = "https://calendar.google.com/calendar/render?action=TEMPLATE";
		str_title = "&text=";
		str_details = "&details=";
		str_location = "&location=";
		str_start = "&dates=";
		str_end = "/";
		extras = "&pli=1&sf=true&output=xml";
		const link = `${str_api}${str_title}${title}${str_details}${title}${str_start}${d1_str}${str_end}${d2_str}${str_location}${window.location.protocol}//${window.location.hostname}${extras}`;
		window.open(link, "_blank");
	};

	const getData = async () => {
		setLoading(true);
		const timeZone = await getChronometerApi();
		let getTimeZone = window.timeZone;
		if (getTimeZone === undefined || getTimeZone === "undefined") {
			getTimeZone = "America/Santiago";
		}
		// const timeZoneAux = momentTimezone.tz(timeZone.eventTime, getTimeZone);
		const timeZoneAux = momentTimezone.tz(
			timeZone.eventTime.toString().split(".")[0],
			"America/Santiago"
		);
		const localTimeZone = momentTimezone.tz(timeZoneAux, getTimeZone);
		setFullDate(moment(localTimeZone).format());
		setFullEndDate(moment(localTimeZone).add(3, "hours").format());
		setDate(moment(localTimeZone).format("LL"));
		setHour(`${moment(localTimeZone).format("LT")} ${getTimeZone}`);

		setUrl(`${window.location.protocol}//${window.location.hostname}`);
		const result = await getConfirmApi();

		if (result.ok) {
			setLoading(false);
			const resp = await getEventOptionsApi();
			if (resp.ok) {
				setTitle(resp.optionsEvent.title);
				if (resp.optionsEvent.index === "signIn") {
					setIndexStatus(true);
				}
				setLoading(false);
			}
		}
		setLoading(false);
	};

	const abrirsesion = () => {
		setSaveData(5);
	};

	const abrirCerrar = () => {
		let doc = document.getElementById("opciones");
		let doc2 = document.getElementById("btn");
		if (doc.style.height === "0px") {
			doc.style.height = "75px";
			//doc.style.opacity = "1";
			//doc.style.visibility = "visible";
			//doc2.style.position = "absolute";
			setSaveData(1);
		} else {
			doc.style.height = "0px";
			//doc.style.opacity = "0";
			//doc.style.visibility = "hidden";
			//doc2.style.zIndex = "9999";
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
			
			<div class="contenedor">
				<div class="m3">
					<div class="header">
						<img src={logo} width="180"/>
						<h2>Gracias por registrarte a Encuentro Corredores Seguros SURA 2021</h2>
					</div>
					<div class="box">
						<h3><span class="material-icons">calendar_today</span> Jueves 2 de Diciembre de 09:00 a 12:00</h3>
						<div className="calendar">
							<button className="btn" onClick={() => abrirCerrar()}>
								AGREGAR A MI CALENDARIO
							</button>
							<div className="opciones" id="opciones" style={{height:"0px"}}>
								<button
									onClick={() =>
										abrirOutlook("Apple")
									}
									id="btn_ical"
									>
									{" "}
									<AppleIcon className="icon2" />
									Apple Calendar{" "}
								</button>
								<button
									onClick={abrirGoogleCalendar}
									id="btn_google"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="google"
										className="svg-inline--fa fa-google fa-w-16 icon"
										role="img"
										viewBox="0 0 488 512"
										width="20px"
									>
										<path
											fill="currentColor"
											d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
										/>
									</svg>{" "}
									Google{" "}
								</button>
								<button
									onClick={() =>
										abrirOutlook("Outlook")
									}
									id="btn_outlook"
								>
									{" "}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="windows"
										className="svg-inline--fa fa-windows fa-w-14 icon"
										role="img"
										viewBox="0 0 448 512"
										width="20px"
									>
										<path
											fill="currentColor"
											d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"
										/>
									</svg>
									Outlook{" "}
								</button>
							</div>
						</div>

					</div>
					<div class="box2">
						<span>Link del evento</span>
						<div class="link">https://surasummit2021.cl</div>
						<div class="btn2"><span class="material-icons">content_copy</span> copiar link</div>
						{/*<div class="btn3">Ingresar a la sala</div>*/}
					</div>



					<div class="copyright">
						Copyright® <strong>www.upwebinar.cl</strong>
					</div>
				</div>

			</div>
			
			
			{/* 
			<div className="fondo-confirm">
				<div className="contenedorConfirmacion">
					<div className="row">
						
						<div className="fondo2">
							<h2 style={{ color: options.titlesColors }}>
								{options.text}
							</h2>
							<div className="card">
								<div className="letras">
									<div>
										<EventIcon
											className="logo"
											alt="calendario"
										/>
										<span style={{ color: options.icons }}>
											{date}
										</span>
									</div>
									<div>
										<AccessTimeIcon
											className="logo"
											alt="reloj"
										/>
										<span style={{ color: options.icons }}>
											{hour}
										</span>
									</div>
								</div>
								<div className="boton">
									<div className="fondo3">
										<button
											id="btn"
											style={{
												backgroundColor:
													options.buttonBackground,
											}}
											onClick={() => abrirCerrar()}
										>
											<p>Agregar a mi calendario</p>
											<ExpandMoreIcon />
										</button>
										<div className="opciones" id="opciones">
											<button
												onClick={() =>
													abrirOutlook("Apple")
												}
												id="btn_ical"
												style={{
													backgroundColor:
														options.buttonBackground,
												}}
											>
												{" "}
												<AppleIcon className="icon2" />
												Apple Calendar{" "}
											</button>
											<button
												onClick={abrirGoogleCalendar}
												id="btn_google"
												style={{
													backgroundColor:
														options.buttonBackground,
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
													focusable="false"
													data-prefix="fab"
													data-icon="google"
													className="svg-inline--fa fa-google fa-w-16 icon"
													role="img"
													viewBox="0 0 488 512"
												>
													<path
														fill="currentColor"
														d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
													/>
												</svg>{" "}
												Google{" "}
											</button>
											<button
												onClick={() =>
													abrirOutlook("Outlook")
												}
												id="btn_outlook"
												style={{
													backgroundColor:
														options.buttonBackground,
												}}
											>
												{" "}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
													focusable="false"
													data-prefix="fab"
													data-icon="windows"
													className="svg-inline--fa fa-windows fa-w-14 icon"
													role="img"
													viewBox="0 0 448 512"
												>
													<path
														fill="currentColor"
														d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"
													/>
												</svg>
												Outlook{" "}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card2">
							<div>
								<span style={{ color: options.textsColors }}>
									Link de ingreso:
								</span>
								<input
									type="text"
									placeholder="Link de ingreso"
									defaultValue={url}
								/>
							</div>
							{indexStatus ? (
								<div className="boton">
									<button
										style={{
											backgroundColor:
												options.buttonBackground,
										}}
										onClick={abrirsesion}
									>
										Iniciar sesión
									</button>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>*/}
		</Spin>
	);
};

export default Confirmacion;

function formatDate(dateString) {
	return dateString.replace(
		/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
		"$1-$2-$3T$4:$5:$6"
	);
}
