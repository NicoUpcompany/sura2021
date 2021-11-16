/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Menu, notification, Spin, Popconfirm } from "antd";
import { UnorderedListOutlined, LoadingOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ScheduleIcon from "@material-ui/icons/Schedule";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { useHistory } from "react-router-dom";
// import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Footer from "../../../components/Basic/Footer/Footer";
import { getAccessTokenApi } from "../../../api/auth";
import { AgendarOwner, EstadoAgenda } from "../../../api/agenda";
import { eventApi } from "../../../api/events";
import { basePath, apiVersion } from "../../../api/config";
import { getWaitingRoomApi } from "../../../api/Admin/waitingRoom";
import Socket from "../../../utils/socket";

import "./Perfil.scss";

const { SubMenu } = Menu;

const Perfil = () => {
	const history = useHistory();

	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [current, setCurrent] = useState("mail");
	const [contador, setContador] = useState(0);
	const [array, setArray] = useState([]);
	const [saveData, setSaveData] = useState(0);
	const [logo, setLogo] = useState(null);
	const [userData, setUserData] = useState(null);
	const [calendarDays, setCalendarDays] = useState([
		{
			dayName: "",
			dayNumber: 0,
		},
	]);
	const [positionDay, setPositionDay] = useState(0);

	useEffect(() => {
		setLoading(true);
		const auxToken = getAccessTokenApi();
		if (auxToken === null) {
			history.push("/iniciarsesion");
		} else {
			const decodedToken = jwtDecode(auxToken);
			if (!decodedToken) {
				history.push("/iniciarsesion");
			} else {
				setToken(auxToken);
				setUserData(decodedToken);
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				getConfig(auxToken);
				Socket.emit("UPDATE_ROUTE", user);
			}
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		const interval = setInterval(() => {
			getAgenda();
		}, 5000);
		return () => clearInterval(interval);
	}, [positionDay, userData, calendarDays]);

	useEffect(() => {
		let action = "pageView";
		let description = "";
		switch (saveData) {
			case 1:
				action = "Menu";
				description = "Sala de Espera";
				break;
			case 2:
				action = "Footer";
				description = "Powered By Up";
				break;
			default:
				break;
		}
		const data = {
			conectionType: window.conectionType,
			page: "/perfil",
			stand: "",
			action,
			description,
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data);
		if (saveData === 1) {
			history.push("/salaespera");
		}
		if (saveData === 2) {
			window.open("https://upwebinar.cl/");
		}
	}, [saveData]);

	useEffect(() => {
		if (userData !== null) {
			const array = [];
			userData.agendaDaysName.forEach((element) => {
				const data = {
					dayName: element.day.split(" ").slice(0, -2).join(" "),
					dayNumber: element.numberDay,
				};
				array.push(data);
			});
			setCalendarDays(array);
		}
	}, [userData]);

	const getConfig = async (auxToken) => {
		const resp = await getWaitingRoomApi(auxToken);
		if (resp.ok) {
			if (!resp.waitingRoom.status) {
				history.push("/streaming");
			} else {
				setLogo(
					`${basePath}/${apiVersion}/waitingroom-image/${resp.waitingRoom.logo}`
				);
				var css = `
					.fondo2 .header2 {
						background: ${resp.waitingRoom.headerColor}; !important;
					}
					.fondo2 .header2 .menu a {
						background: ${resp.waitingRoom.buttonColor} !important;
					}
					.fondo2 .header2 .menu a:hover {
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.horas button {
						border: 1px solid ${resp.waitingRoom.headerTextColor};
						color: ${resp.waitingRoom.headerTextColor};
					}
					.horas button:hover {
						background: ${resp.waitingRoom.buttonHoverColor} !important;
					}
					.MuiIconButton-label {
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					.MuiCheckbox-colorPrimary.Mui-checked {
						color: ${resp.waitingRoom.buttonColor} !important;
					}
					footer {
						background: ${resp.waitingRoom.footerColor}; !important;
					}
				`;
				var style = document.createElement("style");

				if (style.styleSheet) {
					style.styleSheet.cssText = css;
				} else {
					style.appendChild(document.createTextNode(css));
				}
				document.getElementsByTagName("head")[0].appendChild(style);
				setLoading(false);
			}
		}
	};

	const handleClick = (e) => {
		setCurrent({ current: e.key });
	};

	const getAgenda = async () => {
		if (
			calendarDays.length > 0 &&
			userData !== null &&
			calendarDays[positionDay].dayNumber > 0
		) {
			const token = getAccessTokenApi();
			const decodedToken = jwtDecode(token);
			const data = {
				owner: decodedToken.id,
				day: calendarDays[positionDay].dayNumber,
			};
			const result = await AgendarOwner(data, token);
			if (result.ok) {
				const arreglo = result.agenda;
				contarAgendas(arreglo);
				llenarArreglo(arreglo);
				setLoading(false);
			} else {
				contarAgendas([]);
				llenarArreglo([]);
				setLoading(false);
			}
		}
	};

	const llenarArreglo = (array2) => {
		setArray(array2);
	};

	const contarAgendas = (agenda) => {
		agenda.forEach((element) => {
			if (element.user) {
				setContador(contador + 1);
			}
		});
	};

	const rechazar = async (id, dia2) => {
		setLoading(true);
		const result = await EstadoAgenda(token, id);
		if (!result.ok) {
			notification["error"]({
				message: result.message,
			});
			setLoading(false);
		} else {
			notification["success"]({
				message: result.message,
			});
			getAgenda();
			// setMensaje2(result.message);
		}
	};

	const subtraction = () => {
		if (positionDay > 0) {
			setPositionDay(positionDay - 1);
		}
	};

	const addition = () => {
		if (calendarDays.length > positionDay + 1) {
			setPositionDay(positionDay + 1);
		}
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<>
			<Spin
				spinning={loading}
				size="large"
				tip="Cargando..."
				indicator={antIcon}
			>
				<div className="fondo2" style={{ background: "white" }}>
					<div className="header2">
						<div className="logo">
							<img src={logo} alt="logo" />
						</div>
						<div className="menu desktop" style={{ width: "50%" }}>
							<a onClick={() => setSaveData(1)}>SALA DE ESPERA</a>
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
									<Menu.Item key="setting:1">
										<a onClick={() => setSaveData(1)}>
											SALA DE ESPERA
										</a>
									</Menu.Item>
								</SubMenu>
							</Menu>
						</div>
					</div>
					<div className="perfil2">
						<div className="calendario">
							<div className="card">
								<div className="letras">
									<h2>Calendario</h2>
									<h1>{calendarDays[positionDay].dayName}</h1>
								</div>
								<div className="flechas">
									<ArrowBackIosIcon
										className="icono"
										onClick={() => subtraction()}
									/>
									<ArrowForwardIosIcon
										className="icono"
										onClick={() => addition()}
									/>
								</div>
								<div className="horas">
									{array.length > 1
										? array.map((item, i) => {
												return (
													<Button
														variant="contained"
														color="primary"
														className="button"
														startIcon={
															<ScheduleIcon />
														}
														key={i}
													>
														{item.hour}
														<Checkbox
															checked={
																item.active
															}
															color="primary"
															inputProps={{
																"aria-label":
																	"secondary checkbox",
															}}
															onClick={() =>
																rechazar(
																	item._id,
																	calendarDays[
																		positionDay
																	].dayNumber
																)
															}
														/>
													</Button>
												);
										  })
										: null}
								</div>
							</div>
						</div>
						<div className="horasTomadas">
							<div className="pedidas">
								{contador > 0 ? (
									array.length > 1 ? (
										array.map((item, i) => {
											return item.user ? (
												<div className="col" key={i}>
													<strong>
														{item.user.fullName
															.length > 0
															? item.user.fullName
															: null}
														{item.user.name.length >
														0
															? item.user.name
															: null}
														{item.user.lastname
															.length > 0
															? ` ${item.user.lastname}`
															: null}
														{item.user.position
															.length > 0
															? ` - ${item.user.position}`
															: null}
														{item.user.enterprise
															.length > 0
															? ` - ${item.user.enterprise}`
															: null}
													</strong>
													<p>
														Agendado : {item.day}
														/02/2021{" "}
														{item.hour
															.toString()
															.trim()}
													</p>
													<p>
														Descripción :{" "}
														{item.description}
													</p>
													<p>
														<a
															href={item.link}
															rel="noopener noreferrer"
															target="_blank"
														>
															{item.link}
														</a>{" "}
													</p>
													<div className="botones">
														<Popconfirm
															title="¿Estás segur@?"
															onConfirm={() =>
																rechazar(
																	item._id,
																	calendarDays[
																		positionDay
																	].dayNumber
																)
															}
															okText="Si"
															cancelText="No"
														>
															<Button
																variant="contained"
																color="primary"
																className="button"
															>
																Rechazar
															</Button>
														</Popconfirm>
													</div>
												</div>
											) : null;
										})
									) : null
								) : (
									<p
										style={{
											width: "100%",
											textAlign: "center",
										}}
									>
										Aún no se han agendado horas
									</p>
								)}
							</div>
						</div>
					</div>
					<Footer setSaveData={setSaveData} logo={logo} />
				</div>
			</Spin>
		</>
	);
};

export default Perfil;
