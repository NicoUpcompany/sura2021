/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Menu, Spin, notification } from "antd";
import { UnorderedListOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import $ from "jquery";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import { CometChat } from "@cometchat-pro/chat";
import { isSafari, isMobileSafari } from "react-device-detect";

import { getTime } from "../../../api/time";
import { eventApi } from "../../../api/events";
import { getAccessTokenApi } from "../../../api/auth";
import { updateWaitingRoomTimeApi } from "../../../api/user";
import { basePath, apiVersion } from "../../../api/config";
import { getStandApi } from "../../../api/Admin/stands";
import { getWaitingRoomApi } from "../../../api/Admin/waitingRoom";
import { getNetworkingApi } from "../../../api/Admin/networking";

// import logo from "../../../assets/img/cognitiva.svg";
import Agenda from "../../../components/Basic/Agenda/Agenda";
import Stand from "../../../components/Basic/Stand/stand";
import Footer from "../../../components/Basic/Footer/Footer";
import { CometChatUnified } from "../../../components/CometChat";
import Socket from "../../../utils/socket";

import mensaje from "../../../assets/img/mensaje.png";
import audio from "../../../assets/audio/audio.mp3";

import "./WaitingRoom.scss";

const CUSTOMER_MESSAGE_LISTENER_KEY = "client-listener";
const { SubMenu } = Menu;

let COMETCHAT_CONSTANTS = {
	APP_ID: "",
	REGION: "us",
	AUTH_KEY: "",
};

const WaitingRoom = () => {
	const history = useHistory();

	const [current, setCurrent] = useState("mail");
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState(true);
	const [perfilState, setPerfilState] = useState(false);
	const [saveData, setSaveData] = useState(0);
	const [agendaTime, setAgendaTime] = useState(null);
	const [logo, setLogo] = useState(null);
	const [token, setToken] = useState("");
	const [unreadMessage, setUnreadMessage] = useState(0);
	const [notifications, setNotifications] = useState(true);
	const [chat, setChat] = useState(false);
	const [standsData, setStandsData] = useState([]);
	const [config, setConfig] = useState({
		header: "",
		logo: "",
		networking: false,
		status: false,
		agenda: false,
		stand: false,
		headerColor: "default",
		headerTextColor: "default",
		headerTextHoverColor: "default",
		headerChronometerColor: "default",
		buttonColor: "default",
		buttonHoverColor: "default",
		networkingColor: "default",
		networkingText: "Networking",
		networkingTextColor: "default",
		agendaTitleColor: "default",
		agendaHeaderBackground: "default",
		agendaActiveDay: "default",
		agendaDay: "default",
		agendaText: "Agenda",
		standTitle: "Stands",
		standTitleColor: "default",
		footerColor: "default",
	});

	useEffect(() => {
		setLoading(true);
		getNetworkingData();
		let interval;
		getTime2(interval);
		const auxToken = getAccessTokenApi();
		if (auxToken === null) {
			history.push("/iniciarsesion");
		} else {
			const decodedToken = jwtDecode(auxToken);
			if (!decodedToken) {
				history.push("/iniciarsesion");
			} else {
				setToken(auxToken);
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
				if (decodedToken.agenda) {
					setPerfilState(true);
				}
				const data = {
					email: decodedToken.email,
				};
				updateWaitingRoomTimeApi(auxToken, data);
				getStands(auxToken);
				getConfig(auxToken);
				interval = setInterval(() => {
					getRedirect(auxToken);
					cometFunction();
				}, 5000);
				if (!isSafari && !isMobileSafari) {
					const UID = decodedToken.id;
					const apiKey = COMETCHAT_CONSTANTS.AUTH_KEY;
					const GUID = "chat_general";
					const password = "";
					const groupType = CometChat.GROUP_TYPE.PUBLIC;
					CometChat.login(UID, apiKey).then(
						(User) => {
							CometChat.joinGroup(GUID, groupType, password).then(
								(group) => {},
								(error) => {}
							);
						},
						(error) => {}
					);
				}
			}
		}
		return () => {
			clearInterval(interval);
			CometChat.removeMessageListener(CUSTOMER_MESSAGE_LISTENER_KEY);
		};
	}, []);

	const getNetworkingData = async () => {
		const resp = await getNetworkingApi();
		if (resp.ok) {
			COMETCHAT_CONSTANTS.APP_ID = resp.networking.APP_ID;
			COMETCHAT_CONSTANTS.AUTH_KEY = resp.networking.AUTH_KEY;
		}
	};

	useEffect(() => {
		if (notifications && config.networking && !isSafari && !isMobileSafari) {
			CometChat.addMessageListener(
				CUSTOMER_MESSAGE_LISTENER_KEY,
				new CometChat.MessageListener({
					onTextMessageReceived: (textMessage) => {
						const newAudio = new Audio(audio);
						newAudio.play();
						let message = textMessage.data.text;
						if (message.length > 25) {
							message = message.substring(0, 25) + "...";
						}
						notification["info"]({
							message: "Nuevo mensaje",
							description: message,
						});
					},
				})
			);
		} else {
			CometChat.removeMessageListener(CUSTOMER_MESSAGE_LISTENER_KEY);
		}
	}, [notifications]);

	const cometFunction = async () => {
		await CometChat.getUnreadMessageCount().then(
			(array) => {
				let count = 0;
				if (!isEmpty(array.users)) {
					const value = JSON.stringify(array.users).split(",");
					value.forEach((item) => {
						item = item.toString().replace("}", "");
						item = item.toString().replace("{", "");
						const aux = item.split(":");
						count = count + parseInt(aux[1]);
					});
				}
				if (!isEmpty(array.groups)) {
					const value2 = JSON.stringify(array.groups).split(",");
					value2.forEach((item) => {
						item = item.toString().replace("}", "");
						item = item.toString().replace("{", "");
						const aux = item.split(":");
						count = count + parseInt(aux[1]);
					});
				}
				setUnreadMessage(count);
			},
			(error) => {
				setUnreadMessage(0);
			}
		);
	};

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Menu";
				description = "Visitar mi Perfil";
				break;
			case 2:
				action = "Footer";
				description = "Powered By Up";
				break;
			case 3:
				action = "Agenda";
				description = "Entrar al Salón";
				break;
			case 4:
				action = "Cronometro";
				description = "Streaming";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/salaespera",
			stand: "",
			action,
			description,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 1) {
			history.push("/perfil");
		}
		if (saveData === 2) {
			window.open("https://www.upwebinar.cl/", "_blank");
		}
		if (saveData === 3 || saveData === 4) {
			history.push("/streaming");
		}
	}, [saveData]);

	const handleClick = (e) => {
		setCurrent({ current: e.key });
	};

	const getRedirect = async (auxToken) => {
		const resp = await getWaitingRoomApi(auxToken);
		if (resp.ok) {
			if (!resp.waitingRoom.status) {
				history.push("/streaming");
			}
		}
	}

	const getConfig = async (auxToken) => {
		const resp = await getWaitingRoomApi(auxToken);
		if (resp.ok) {
			if (!resp.waitingRoom.status) {
				history.push("/streaming");
			} else {
				setLogo(`${basePath}/${apiVersion}/waitingroom-image/${resp.waitingRoom.logo}`);
				var css = `
					.fondo .header2 {
						background-image: url(${basePath}/${apiVersion}/waitingroom-image/${resp.waitingRoom.header}) !important;
					}
					.fondo .menu {
						background: ${resp.waitingRoom.headerColor} !important;
					}
					.fondo .menu .subMenu .perfil {
						color: ${resp.waitingRoom.headerTextColor} !important;
						border: 2px solid ${resp.waitingRoom.headerTextColor} !important;
					}
					.fondo .menu .subMenu .perfil:hover {
						color: ${resp.waitingRoom.headerTextHoverColor} !important;
						border: 2px solid ${resp.waitingRoom.headerTextHoverColor} !important;
					}
					.fondo .menu .subMenu a {
						color: ${resp.waitingRoom.headerTextColor} !important;
					}
					.fondo .menu .subMenu a:hover {
						color: ${resp.waitingRoom.headerTextHoverColor} !important;
					}
					.fondo .header2 .centrado .cronometro div {
						color: ${resp.waitingRoom.headerChronometerColor} !important;
					}
					.fondo .header2 .centrado .cronometro div h1 {
						color: ${resp.waitingRoom.headerChronometerColor} !important;
					}
					.fondo .header2 .centrado .cronometro div span {
						color: ${resp.waitingRoom.headerChronometerColor} !important;
					}
					.fondo .header2 .centrado .btn button {
						background: ${resp.waitingRoom.buttonColor} !important;
					}
					.row2 .plenario .texto2 .conFondo {
						background: ${resp.waitingRoom.buttonColor} !important;
					}
					.fondo .header2 .centrado .btn button:hover {
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.row2 .plenario .texto2 .conFondo:hover {
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					footer {
						background: ${resp.waitingRoom.footerColor}; !important;
					}
				`;
				if (resp.waitingRoom.networking) {
					css = css + `
					.pregunta2 .card .barra {
						background: linear-gradient(${resp.waitingRoom.networkingColor}, ${resp.waitingRoom.networkingColor}) !important;
					}
					`
				}
				if (resp.waitingRoom.agenda) {
					css = css + `
					.fondo .contenedorAgenda .tituloAgenda h1 {
						color: ${resp.waitingRoom.agendaTitleColor} !important;
					}
					.fondo .contenedorAgenda .days {
						background: ${resp.waitingRoom.agendaHeaderBackground} !important;
					}
					.fondo .contenedorAgenda .days button {
						color: ${resp.waitingRoom.agendaDay} !important;
					}
					.fondo .contenedorAgenda .days .clasee {
						color: ${resp.waitingRoom.agendaActiveDay} !important;
					}
					.row4 p,
					.row2 .tiempo p,
					.row2 .duracion p,
					.row2 .plenario .texto1 strong,
					.row2 .imagenes .imagen .nombrecolaborador {
						color: #000000 !important;
					}
					.break {
						background: ${resp.waitingRoom.agendaHeaderBackground} !important;
					}
					.break .tiempo a .caffe,
					.break .tiempo span,
					.break .duracion p {
						color: ${resp.waitingRoom.agendaActiveDay} !important;
					}
					`
				}
				if (resp.waitingRoom.stand) {
					css = css + `
					.fondo .contenedor .titulo h2 {
						color: ${resp.waitingRoom.standTitleColor} !important;
					}
					.tituloDialog h1 {
						color: ${resp.waitingRoom.standTitleColor} !important;
					}
					.description .titulo h1 {
						color: ${resp.waitingRoom.standTitleColor} !important;
					}
					.tituloDialog .icono2 {
						fill: ${resp.waitingRoom.buttonColor} !important;
					}
					.tituloDialog .icono {
						fill: ${resp.waitingRoom.buttonColor} !important;
					}
					.confirmacionAgenda .titulo div span .icono {
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					.MuiFormLabel-root.Mui-focused {
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
						border-color: ${resp.waitingRoom.buttonColor} !important;
					}
					.dias .icon {
						color: ${resp.waitingRoom.buttonColor} !important;
						fill: ${resp.waitingRoom.buttonColor} !important;
					}
					.confirmacionAgenda .divi button {
						border: 1px solid${resp.waitingRoom.buttonColor} !important;
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					.horas button {
						border: 1px solid ${resp.waitingRoom.buttonColor} !important;
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					.horas button:hover {
						border: 1px solid ${resp.waitingRoom.buttonHoverColor} !important;
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.horas button:focus {
						border: 1px solid ${resp.waitingRoom.buttonHoverColor} !important;
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.botones2 div .btn2 {
						background: ${resp.waitingRoom.buttonColor} !important;
					}
					.standMediano .botones .mitad .btn2 {
						background: ${resp.waitingRoom.buttonColor} !important;
					}
					.standMediano .botones .mitad .btn2:hover {
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.standMediano .foot2 {
						background: ${resp.waitingRoom.footerColor}; !important;
					}
					.standMediano .slick-dots li.slick-active button {
						background: ${resp.waitingRoom.footerColor}; !important;
					}
					`
				}
				var style = document.createElement("style");

				if (style.styleSheet) {
					style.styleSheet.cssText = css;
				} else {
					style.appendChild(document.createTextNode(css));
				}
				setConfig({
					agenda: resp.waitingRoom.agenda,
					header: resp.waitingRoom.header,
					networking: resp.waitingRoom.networking,
					stand: resp.waitingRoom.stand,
					status: resp.waitingRoom.status,
					headerColor: resp.waitingRoom.headerColor,
					headerTextColor: resp.waitingRoom.headerTextColor,
					headerTextHoverColor: resp.waitingRoom.headerTextHoverColor,
					headerChronometerColor: resp.waitingRoom.headerChronometerColor,
					buttonColor: resp.waitingRoom.buttonColor,
					buttonHoverColor: resp.waitingRoom.buttonHoverColor,
					networkingColor: resp.waitingRoom.networkingColor,
					networkingText: resp.waitingRoom.networkingText,
					networkingTextColor: resp.waitingRoom.networkingTextColor,
					agendaTitleColor: resp.waitingRoom.agendaTitleColor,
					agendaHeaderBackground: resp.waitingRoom.agendaHeaderBackground,
					agendaActiveDay: resp.waitingRoom.agendaActiveDay,
					agendaDay: resp.waitingRoom.agendaDay,
					agendaText: resp.waitingRoom.agendaText,
					standTitle: resp.waitingRoom.standTitle,
					standTitleColor: resp.waitingRoom.standTitleColor,
					footerColor: resp.waitingRoom.footerColor,
				});
				document.getElementsByTagName("head")[0].appendChild(style);
				setLoading(false);
			}
		}
	};

	const getStands = async (auxToken) => {
		const resp = await getStandApi(auxToken);
		if (resp.ok) {
			setStandsData(resp.stands);
		}
	};

	const getTime2 = async (interval) => {
		setLoading(true);
		try {
			const resp = await getTime();
			const timeApi = moment(resp.time).valueOf();
			setAgendaTime(resp.time);
			$(".cronometro").each(function () {
				const $this = $(this);
				let now = timeApi;

				interval = setInterval(function () {
					const countDownDate = moment(resp.eventTime).valueOf();
					const distance = countDownDate - now;
					const days_t = Math.floor(distance / (1000 * 60 * 60 * 24));
					const hours_t = Math.floor(
						(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					);
					const minutes_t = Math.floor(
						(distance % (1000 * 60 * 60)) / (1000 * 60)
					);
					const seconds_t = Math.floor(
						(distance % (1000 * 60)) / 1000
					);
					let days, m1, m2, hours, minutes, seconds;
					if (days_t < 10) {
						days = "0" + days_t;
					} else {
						m1 = String(days_t).substring(0, 1);
						m2 = String(days_t).substring(1, 2);
						days = m1 + m2;
					}
					if (hours_t < 10) {
						hours = "0" + hours_t;
					} else {
						m1 = String(hours_t).substring(0, 1);
						m2 = String(hours_t).substring(1, 2);
						hours = m1 + m2;
					}
					if (minutes_t < 10) {
						minutes = "0" + minutes_t;
					} else {
						m1 = String(minutes_t).substring(0, 1);
						m2 = String(minutes_t).substring(1, 2);
						minutes = m1 + m2;
					}
					if (seconds_t < 10) {
						seconds = "0" + seconds_t;
					} else {
						m1 = String(seconds_t).substring(0, 1);
						m2 = String(seconds_t).substring(1, 2);
						seconds = m1 + m2;
					}
					$this.empty();
					if (countDownDate > now) {
						$this.append(
							"<div><h1>" + days + "</h1><span>Días</span></div>"
						);
						$this.append(
							"<div><h1>" +
								hours +
								"</h1><span>Horas</span></div>"
						);
						$this.append(
							"<div><h1>" +
								minutes +
								"</h1><span>Minutos</span></div>"
						);
						$this.append(
							"<div><h1>" +
								seconds +
								"</h1><span>Segundos</span></div>"
						);
						setLoading(false);
					} else {
						setLoading(false);
						setState(false);
						clearInterval(interval);
					}
					now = moment(now).add(1, "seconds").valueOf();
				}, 1000);
			});
			setLoading(false);
		} catch (exception) {
			setLoading(false);
			console.log(exception);
		}
	};

	const OnOffNotifications = () => {
		let action;
		if (notifications) {
			action = "Silenciar notificaciones";
		} else {
			action = "Activar notificaciones";
		}
		const data = {
			conectionType: window.conectionType,
			page: "/salaespera",
			stand: "",
			action,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		setNotifications(!notifications);
	};

	const changeChatStatus = () => {
		let action;
		if (chat) {
			action = "Cerrar Chat";
		} else {
			action = "Abrir Chat";
		}
		const data = {
			conectionType: window.conectionType,
			page: "/salaespera",
			stand: "",
			action,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		setChat(!chat);
	};

	const handleClickAbrir = (id) => {
		const data = {
			conectionType: window.conectionType,
			page: "/salaespera",
			stand: id,
			action: "Stand",
			description: "Abrir Stand",
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		const doc = document.getElementById(id);
		const doc2 = document.getElementById("fondoStand");
		doc2.style.left = "0px";
		doc.style.right = "0px";
		doc.style.transitionDuration = "1s";
		doc2.style.transitionDuration = "1s";
		const bodi = document.getElementsByTagName("body");
		bodi[0].classList.add("stop");
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<Spin
			spinning={loading}
			size="large"
			tip="Cargando..."
			indicator={antIcon}
		>
			{chat ? (
				<>
					<CometChatUnified />
					<div className="pregunta2">
						<div className="card">
							<div className="barra fadeInUpBig">
								<h3 onClick={() => changeChatStatus()}>
									{config.networkingText}
								</h3>
								<div className="message">
									<Tooltip
										title="Cerrar networking"
										placement="top"
									>
										<img
											src={mensaje}
											alt="mensaje"
											className="mensaje"
											onClick={() => changeChatStatus()}
										/>
									</Tooltip>
									{unreadMessage > 0 ? (
										<span className="noti">
											{unreadMessage}
										</span>
									) : null}
									{notifications ? (
										<div
											onClick={OnOffNotifications}
											className="volumen"
										>
											<Tooltip
												title="Silenciar Notificaciones"
												placement="top"
											>
												<VolumeUpIcon className="icon" />
											</Tooltip>
										</div>
									) : (
										<div
											onClick={OnOffNotifications}
											className="volumen"
										>
											<Tooltip
												title="Habilitar Notificaciones"
												placement="top"
											>
												<VolumeOffIcon className="icon" />
											</Tooltip>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="fondo">
						<div className="menu">
							<div className="logo">
								<img src={logo} alt="logo" />
							</div>
							<div className="subMenu desktop">
								{perfilState ? (
									<a
										onClick={() => setSaveData(1)}
										className="perfil"
									>
										Visitar mi Perfil
									</a>
								) : null}
								{config.agenda ? (
									<a href="#agenda">{config.agendaText}</a>
								) : null}
								{config.stand ? (
									<a href="#stands">{config.standTitle}</a>
								) : null}
								{state ? null : (
									<Link to="/streaming" className="perfil">Streaming</Link>
								)}
							</div>
							<div className="movil">
								<Menu
									onClick={handleClick}
									selectedKeys={[current]}
									mode="horizontal"
								>
									<SubMenu
										key="SubMenu"
										icon={<UnorderedListOutlined />}
										title=""
									>
										{perfilState ? (
											<Menu.Item key="setting:1">
												<a
													onClick={() =>
														setSaveData(1)
													}
													className="opcion"
												>
													Visitar mi Perfil
												</a>
											</Menu.Item>
										) : null}
										{config.agenda ? (
											<Menu.Item key="setting:2">
												<a
													className="opcion"
													href="#agenda"
												>
													{config.agendaText}
												</a>
											</Menu.Item>
										) : null}
										<Menu.Item key="setting:3">
											<a
												className="opcion"
												href="#stands"
											>
												{config.standTitle}
											</a>
										</Menu.Item>
										{state ? null : (
											<Menu.Item key="setting:4">
												<Link
													className="opcion"
													to="/streaming"
												>
													STREAMING
												</Link>
											</Menu.Item>
										)}
									</SubMenu>
								</Menu>
							</div>
						</div>
						<div className="header2">
							{state ? (
								<div className="centrado">
									<div className="cronometro"></div>
								</div>
							) : (
								<div className="centrado">
									<div className="btn">
										<button onClick={() => setSaveData(4)}>
											Streaming
										</button>
									</div>
								</div>
							)}
							{config.networking && !isSafari && !isMobileSafari ? (
								<div className="pregunta2">
									<div className="card">
										<div className="barra fadeInUpBig">
											<h3
												onClick={() =>
													changeChatStatus()
												}
											>
												{config.networkingText}
											</h3>
											<div className="message">
												<Tooltip
													title="Ingresar a networking"
													placement="top"
												>
													<img
														src={mensaje}
														alt="mensaje"
														className="mensaje"
														onClick={() =>
															changeChatStatus()
														}
													/>
												</Tooltip>
												{unreadMessage > 0 ? (
													<span className="noti">
														{unreadMessage}
													</span>
												) : null}
												{notifications ? (
													<div
														onClick={
															OnOffNotifications
														}
														className="volumen"
													>
														<Tooltip
															title="Silenciar Notificaciones"
															placement="top"
														>
															<VolumeUpIcon className="icon" />
														</Tooltip>
													</div>
												) : (
													<div
														onClick={
															OnOffNotifications
														}
														className="volumen"
													>
														<Tooltip
															title="Habilitar Notificaciones"
															placement="top"
														>
															<VolumeOffIcon className="icon" />
														</Tooltip>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							) : null}
						</div>
						{config.agenda ? (
							<Agenda
								agendaTitle={config.agendaText}
								agendaTime={agendaTime}
								state={state}
								setSaveData={setSaveData}
								token={token}
							/>
						) : null}
						{config.stand ? (
							<>
								<div className="contenedor">
									<div className="titulo" id="stands">
										<h2>{config.standTitle}</h2>
									</div>
									<div className="stands2">
										{standsData.map((item, i) => {
											return (
												<div className="col-3">
													<img
														src={`${basePath}/${apiVersion}/stand-image/${item.logoExt}`}
														className="img"
														alt={`${item.name}Logo`}
														width="100%"
														onClick={() =>
															handleClickAbrir(
																item.name
															)
														}
													/>
													{/* <img
														src={stand}
														width="100%"
														alt="stand"
														onClick={() =>
															handleClickAbrir(
																item.name
															)
														}
													/> */}
												</div>
											);
										})}
									</div>
								</div>
								<div className="fondoStand" id="fondoStand">
									{standsData.map((item, i) => {
										return (
											<Stand data={item} token={token} />
										);
									})}
								</div>
							</>
						) : null}
					</div>
					<Footer setSaveData={setSaveData} logo={logo} />
				</>
			)}
		</Spin>
	);
};

export default WaitingRoom;

function isEmpty(obj) {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
}
