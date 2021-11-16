/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { notification, Spin } from "antd";
import { LoadingOutlined, CloseCircleFilled, WhatsAppOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import footer from "../../../assets/img/paginaweb.png";
import footer2 from "../../../assets/img/telefono.png";
import footer3 from "../../../assets/img/email.png";

import { eventApi } from "../../../api/events";
import { basePath, apiVersion } from "../../../api/config";
import { getButtonApi } from "../../../api/Admin/button";
import {
	getAgendaStandByDayApi,
	putAgendaStandApi,
} from "../../../api/Admin/agendaStand";


//Imagenes stand
import headerImg from '../../../assets/images/stand/header.png';
import logoImg from '../../../assets/images/stand/logo.png';

import "./Stand.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	button: {
		margin: "0px",
	},
}));

const Stand = ({ data, token }) => {
	const [dia, setDia] = useState(0);
	const [fecha, setFecha] = useState("");
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [idUsuario, setIdUsuario] = useState("");
	const [buttonId, setButtonId] = useState("");
	const [idAgenda, setIdAgenda] = useState("");
	const [hora, setHora] = useState("");
	const [link, setLink] = useState("");
	const classes = useStyles();
	const [array, setArray] = useState([]);
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState("");
	const [inputs, setInputs] = useState({
		description: "",
	});
	const [buttonStatus, setButtonStatus] = useState(false);
	const [buttonData, setButtonData] = useState([]);
	const [agendaDays, setAgendaDays] = useState([]);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 2,
	};

	useEffect(() => {
		getButtons();
	}, []);

	const getButtons = async () => {
		const resp = await getButtonApi(token, data._id);
		if (resp.ok) {
			console.log(resp);
			setButtonStatus(true);
			setButtonData(resp.buttons);
			resp.buttons.forEach((element) => {
				if (element.agenda) {
					setButtonId(element._id);
					setAgendaDays(element.agendaDays);
					setIdUsuario(element.agendaDays[0].owner);
				}
			});
		}
	};

	const close2 = () => {
		const doc = document.getElementById(data.name);
		doc.style.right = "-660px";
		doc.style.transitionDuration = "1s";
		const doc2 = document.getElementById("fondoStand");
		doc2.style.left = "100vw";
		doc2.style.transitionDuration = "1s";
		const bodi = document.getElementsByTagName("body");
		bodi[0].classList.remove("stop");
		const data2 = {
			conectionType: window.conectionType,
			page: window.location.pathname,
			stand: data.name,
			action: "Stand",
			description: "Cerrar Stand",
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data2);
	};

	const abrirwsp = (numero, text) => {
		const url =
			"https://api.whatsapp.com/send/?phone=" +
			numero +
			"&text=" +
			text +
			"&app_absent=0&lang=es";
		window.open(url, "_blank");
		const dataAux = {
			conectionType: window.conectionType,
			page: window.location.pathname,
			stand: data.name,
			action: "Stand",
			description: "Abrir WhatsApp",
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(dataAux);
	};

	const redirectButton = (url) => {
		window.open(url, "_blank");
	};

	const consultar = async (dia, fecha) => {
		setLoading(true);
		const data = {
			button: buttonId,
			day: dia,
		};
		const respuesta = await getAgendaStandByDayApi(token, data);
		if (respuesta.ok) {
			setLoading(false);
			const arreglo = respuesta.agenda;
			setDia(dia);
			setFecha(fecha);
			llenarArreglo(arreglo);
		}
	};

	const agendar2 = () => {
		setOpen3(true);
	};

	const agendar = async () => {
		setLoading(true);
		const decodedToken = jwtDecode(token);
		if (!decodedToken) {
			window.location.href = "/iniciarsesion";
		}
		const data2 = {
			conectionType: window.conectionType,
			page: window.location.pathname,
			stand: data.name,
			action: "Stand",
			description: "Agendar",
			country: window.country,
			userId: localStorage.getItem("userID"),
		};
		eventApi(data2);
		const dataAux = {
			user: decodedToken.id,
			description: inputs.description,
		};
		if (idAgenda.trim().length > 1) {
			if (inputs.description.trim() !== "") {
				const respuesta = await putAgendaStandApi(
					token,
					dataAux,
					idAgenda
				);
				if (!respuesta.ok) {
					notification["error"]({
						message: respuesta.message,
					});
					setLoading(false);
				} else {
					notification["success"]({
						message: "Hora agendada",
					});
					setLink(respuesta.link);
					setOpen2(true);
					setOpen3(false);
					setLoading(false);
				}
			} else {
				notification["error"]({
					message: "Ingrese una descripción",
				});
			}
		} else {
			notification["error"]({
				message: "Seleccione un horario",
			});
		}
	};

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const llenarArreglo = (array2) => {
		setArray(array2);
	};

	const cancelar = () => {
		setDia(0);
		const arreglo = [];
		setArray(arreglo);
		setOpen(false);
		setIdAgenda("");
	};

	const cancelar2 = () => {
		setOpen3(false);
		setDescription("");
	};

	const cambioDeEstados = (id, hora) => {
		setIdAgenda(id);
		setHora(hora);
	};

	const finalizar = () => {
		setLink("");
		setHora("");
		setDia(0);
		setIdAgenda("");
		const arreglo = [];
		setArray(arreglo);
		setOpen(false);
		setOpen2(false);
	};

	const redirect = (link) => {
		if (link.length > 0) {
			window.open(link, "_blank");
		}
	};

	const downloadfile = (url) => {
		window.open(url, "_blank");
	};

	const antIcon = <LoadingOutlined spin />;

	return (
		<>
			<div className="standMediano" id={`${data.name}`}>
				<CloseCircleFilled
					style={{ fontSize: "32px" }}
					className="close"
					onClick={close2}
				/>
				{/* <div className="header">
					{data.header.length > 0 ? (
						<LazyLoadImage
							alt="alt2"
							effect="blur"
							src={`${basePath}/${apiVersion}/stand-image/${data.header}`}
							width="650px"
							height="380px"
						/>
					) : (
						<LazyLoadImage
							alt="alt2"
							effect="blur"
							src="http://placehold.it/650x380"
							width="650px"
							height="380px"
						/>
					)}
					{data.logo.length > 0 ? (
						<img
							alt="alt3"
							src={`${basePath}/${apiVersion}/stand-image/${data.logo}`}
							className="logotipo"
							width="100px"
							height="100px"
						/>
					) : null}
				</div> */}
				<div className="header">
					<LazyLoadImage
						alt="alt2"
						effect="blur"
						src={headerImg}
						width="650px"
						height="auto"
					/>
					{/* <img
						alt="alt3"
						src={logoImg}
						className="logotipo"
						width="100px"
						height="100px"
					/> */}
				</div>
				<div className="content2">
					<h2>{data.title}</h2>
					{/* <p>{data.description}</p> */}
					<p>Impulsamos la transformación digital de las empresas con Inteligencia Artificial a través de una oferta de servicios que se adapta a las necesidades de cada cliente. Nuestras soluciones cuentan con el respaldo de más de 100 casos de éxito.</p>
					{data.video.length > 0 ? (
						<iframe
							title="video"
							width="560"
							height="315"
							className="transmission"
							// src={data.video}
							src="https://player.vimeo.com/video/610027711?h=e642d9d9e9" 
							frameBorder="0"
							allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							style={{ marginBottom: "15px" }}
						></iframe>
					) : null}
					{/* <div className="imagenes">
						<Slider {...settings}>
							{data.image1.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image1}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect1)}
									/>
								</div>
							) : null}
							{data.image2.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image2}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect2)}
									/>
								</div>
							) : null}
							{data.image3.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image3}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect3)}
									/>
								</div>
							) : null}
							{data.image4.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image4}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect4)}
									/>
								</div>
							) : null}
							{data.image5.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image5}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect5)}
									/>
								</div>
							) : null}
							{data.image6.length > 0 ? (
								<div className="imagen">
									<LazyLoadImage
										alt="alt2"
										src={`${basePath}/${apiVersion}/stand-image/${data.image6}`}
										width="270px"
										height="170px"
										effect="blur"
										style={{ cursor: "pointer" }}
										onClick={() => redirect(data.redirect6)}
									/>
								</div>
							) : null}
						</Slider>
					</div> */}
					<div className="botones">
						{buttonData.map((item, i) => {
							return (
								<div className="mitad" key={i}>
									{item.whatsapp ? (
										<button
											className="btn2"
											id="whatsapp"
											onClick={() =>
												abrirwsp(
													item.whatsappNumber,
													item.whatsappText
												)
											}
										>
											<WhatsAppOutlined /> {item.text}
										</button>
									) : null}
									{item.redirect ? (
										<button
											className="btn2"
											onClick={() =>
												redirectButton(item.redirectUrl)
											}
										>
											{item.text}
										</button>
									) : null}
									{item.file ? (
										<button
											className="btn2"
											onClick={() =>
												downloadfile(
													`${basePath}/${apiVersion}/button-file/${item.fileName}`
												)
											}
										>
											{item.text}
										</button>
									) : null}
									{item.agenda ? (
										<button
											className="btn2"
											onClick={() => setOpen(true)}
										>
											{item.text}
										</button>
									) : null}
								</div>
							);
						})}
					</div>
					<div className="foot2">
						{data.page.length > 0 ? (
							<div className="itemFooter">
								<img src={footer} alt="footer" />
								<a>{data.page}</a>
							</div>
						) : null}
						{data.email.length > 0 ? (
							<div className="itemFooter">
								<img src={footer3} alt="footer3" />
								<a href={`mailto:${data.email}`}>
									{data.email}
								</a>
							</div>
						) : null}
						{data.phone.length > 0 ? (
							<div className="itemFooter">
								<img src={footer2} alt="footer2" />
								<a href={`tel:${data.phone}`}>{data.phone}</a>
							</div>
						) : null}
					</div>
				</div>
				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={() => setOpen(false)}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							{dia === 0 ? (
								<>
									<div className="tituloDialog">
										<CancelIcon
											className="icono2"
											onClick={() => setOpen(false)}
										/>
										<h1>SELECCIONA DÍA</h1>
									</div>
									<div className="dias">
										{agendaDays.map((item, i) => {
											return (
												<div key={i}>
													<Button
														variant="contained"
														color="primary"
														className={
															classes.button
														}
														onClick={() =>
															consultar(
																item.numberDay,
																item.day
															)
														}
														startIcon={
															<DateRangeIcon className="icon" />
														}
													>
														{item.day}
													</Button>
												</div>
											);
										})}
									</div>
								</>
							) : (
								<>
									<div className="tituloDialog">
										<CancelIcon
											className="icono"
											onClick={() => setDia(0)}
										/>
										<h1 className="titulin">
											ELIGE UN HORARIO
										</h1>
									</div>
									<div className="horas">
										{array.length > 1 ? (
											array.map((item, i) => {
												return (
													<div>
														<Button
															variant="contained"
															color="primary"
															className="button"
															startIcon={
																<ScheduleIcon />
															}
															onClick={() =>
																cambioDeEstados(
																	item._id,
																	item.hour
																)
															}
														>
															{item.hour}
														</Button>
													</div>
												);
											})
										) : (
											<p>No hay horarios disponibles</p>
										)}
									</div>
									<div className="botones2">
										<div>
											<Button
												variant="contained"
												color="primary"
												className="btn1"
												startIcon={<HighlightOffIcon />}
												onClick={cancelar}
											>
												Cancelar
											</Button>
										</div>
										<div>
											<Button
												variant="contained"
												color="primary"
												className="btn2"
												startIcon={<AlarmOnIcon />}
												onClick={() => agendar2()}
											>
												Agendar
											</Button>
										</div>
									</div>
								</>
							)}
						</DialogContentText>
					</DialogContent>
				</Dialog>
				<Dialog
					open={open2}
					TransitionComponent={Transition}
					keepMounted
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogContent>
						<div className="confirmacionAgenda">
							<div className="done">
								<CheckCircleIcon className="icon" />
							</div>
							<div className="titulo">
								<h1>Tu reunión está agendada</h1>
								<div>
									<span>
										<DateRangeIcon className="icono" />{" "}
										{fecha}
									</span>
									<span>
										<ScheduleIcon className="icono" />{" "}
										{hora} hrs
									</span>
								</div>
							</div>
							<div className="link">
								<span>
									Link de ingreso:{" "}
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
									>
										{" "}
										{link}{" "}
									</a>{" "}
								</span>
							</div>
							<div className="divi">
								<Button
									variant="contained"
									color="primary"
									className="btn2"
									startIcon={<CheckCircleOutlineIcon />}
									onClick={finalizar}
								>
									Aceptar
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
				<Dialog
					open={open3}
					TransitionComponent={Transition}
					keepMounted
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogContent>
						<Spin
							spinning={loading}
							size="large"
							tip="Cargando..."
							indicator={antIcon}
						>
							<div
								className="description"
								id="description"
								style={{ zIndex: "999px" }}
							>
								<div className="titulo">
									<h1>Ingrese una descripción</h1>
								</div>
								<div className="des">
									<TextField
										id="outlined-basic"
										label="Descripción"
										variant="outlined"
										className="input"
										type="text"
										name="description"
										onChange={changeForm}
										value={inputs.description}
									/>
								</div>
								<div className="botones2">
									<div>
										<Button
											variant="contained"
											color="primary"
											className="btn1"
											startIcon={<HighlightOffIcon />}
											onClick={cancelar2}
										>
											Cancelar
										</Button>
									</div>
									<div>
										<Button
											variant="contained"
											color="primary"
											className="btn2"
											startIcon={<AlarmOnIcon />}
											onClick={() => agendar()}
										>
											Agendar
										</Button>
									</div>
								</div>
							</div>
						</Spin>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};

export default Stand;
