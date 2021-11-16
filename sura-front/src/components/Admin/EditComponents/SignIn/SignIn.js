/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Spin, Drawer, Button } from "antd";
import {
	LoadingOutlined,
	EditOutlined,
	PictureOutlined,
	MobileOutlined,
	LaptopOutlined,
} from "@ant-design/icons";
import $ from "jquery";
import moment from "moment";
import parse from 'html-react-parser';

import { getTime } from "../../../../api/time";
import {
	getSignInApi,
	getSignInImageApi,
	putResizeSignInApi,
} from "../../../../api/Admin/singIn";
import { useResize } from "../../../../hooks/useResize";
import { Handle, Resizable } from "./components/style";

import FormLogin from "./components/Form";
import DrawerComponent from "./components/drawers/Drawer";
import DrawerLogoComponent from "./components/drawers/DrawerLogo";
import DrawerBackComponent from "./components/drawers/DrawerBack";
import DrawerEditorComponent from "./components/drawers/DrawerEditor";

import "./SignIn.scss";

const SignInOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	const [logo, setLogo] = useState("");
	const [width, setWidth] = useState("1280px");
	const [height, setHeight] = useState("100vh");
	const [options, setOptions] = useState({
		title: "",
		text: "",
		logo: "",
		widthLogo: "500px",
		heightLogo: "auto",
		background: "",
		buttonBackground: "default",
		buttonBackgroundHover: "default",
		titlesColors: "default",
		textsColors: "default",
		chronometerColors: "default",
	});

	// Resize
	const ref = useRef();
	const resizeOptions = {
		step: 40,
		axis: "both",
	};
	let { initResize, size, cursor } = useResize(ref, resizeOptions);

	useEffect(() => {
		try {
			if (!isNaN(size.width) && !isNaN(size.height)) {
				const data = {
					widthLogo: size.width,
					heightLogo: size.height,
				};
				putResizeSignInApi(token, data, optionsId);
			}
		} catch (error) {
			console.log(error);
		}
	}, [size]);

	// Drawers
	const [saveSignIn, setSaveSignIn] = useState(false);
	const [saveLogo, setSaveLogo] = useState(false);
	const [saveBack, setSaveBack] = useState(false);
	const [saveEditor, setSaveEditor] = useState(false);
	const [state, setState] = useState(true);
	const [visible, setVisible] = useState(false);
	const [visibleLogo, setVisibleLogo] = useState(false);
	const [visibleBack, setVisibleBack] = useState(false);
	const [visibleEditor, setVisibleEditor] = useState(false);
	const [background, setBackground] = useState(null);
	const [status, setStatus] = useState(false);
	const [optionsId, setOptionsId] = useState("");
	const [adminOptions, setAdminOptions] = useState({
		title: "",
		text: "",
		logo: "",
		background: "",
		widthLogo: "500px",
		heightLogo: "auto",
		buttonBackground: "default",
		buttonBackgroundHover: "default",
		titlesColors: "default",
		textsColors: "default",
		chronometerColors: "default",
		statusCode: false,
		htmlCode: "",
		cssCode: "",
		jsCode: "",
	});
	const [html, setHtml] = useState("");
	const [css, setCss] = useState("");
	const [js, setJs] = useState("");

	// Drawer Crop 1
	const previewCanvasRef1 = useRef(null);
	const [fileExt1, setFileExt1] = useState("");
	const [upImg1, setUpImg1] = useState();

	// Drawer Crop 2
	const previewCanvasRef2 = useRef(null);
	const [fileExt2, setFileExt2] = useState("");
	const [upImg2, setUpImg2] = useState();

	useEffect(() => {
		let interval;
		getTime2(interval);
		getData();
	}, []);

	useEffect(() => {
		getConfig();
	}, [reload]);

	const getTime2 = async (interval) => {
		try {
			const resp = await getTime();
			const timeApi = moment(resp.time).valueOf();
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
					} else {
						setState(false);
						clearInterval(interval);
					}
					now = moment(now).add(1, "seconds").valueOf();
				}, 1000);
			});
		} catch (exception) {
			console.log(exception);
		}
	};

	const getConfig = async () => {
		setLoading(true);
		const result = await getSignInApi();
		if (result.ok) {
			setHtml(result.signIn.htmlCode);
			setCss(result.signIn.cssCode);
			setJs(result.signIn.jsCode);
			setOptions({
				...options,
				title: result.signIn.title,
				text: result.signIn.text,
				widthLogo: result.signIn.widthLogo,
				heightLogo: result.signIn.heightLogo,
				buttonBackground: result.signIn.buttonBackground,
				buttonBackgroundHover: result.signIn.buttonBackgroundHover,
				titlesColors: result.signIn.titlesColors,
				textsColors: result.signIn.textsColors,
				chronometerColors: result.signIn.chronometerColors,
				statusCode: result.signIn.statusCode,
				htmlCode: result.signIn.htmlCode,
				cssCode: result.signIn.cssCode,
				jsCode: result.signIn.jsCode,
			});
			if (result.signIn.logo.length > 0) {
				const logoResult = await getSignInImageApi(result.signIn.logo);
				setLogo(logoResult);
			}
			if (result.signIn.background.length > 0) {
				const backgroundResult = await getSignInImageApi(
					result.signIn.background
				);
				var css = `
					.fondo-signin-admin .contenedorRegistro {
						background-image: url(${backgroundResult}) !important;
					}
					.campobutton button {
						background-color: ${result.signIn.buttonBackground} !important;
					}
					.login-form__button {
						background-color: ${result.signIn.buttonBackground} !important;
					}
					.campobutton button:hover{
						background-color: ${result.signIn.buttonBackgroundHover} !important;
						color: white !important;
					}
					.login-form__button:hover{
						background-color: ${result.signIn.buttonBackgroundHover} !important;
						color: white !important;
					}
					.fondo-signin-admin .contenedorRegistro .row .form .cronometro div {
						color: ${result.signIn.chronometerColors} !important;
					}
					.fondo-signin-admin .contenedorRegistro .row .form .cronometro div h1 {
						color: ${result.signIn.chronometerColors} !important;
					}
					.fondo-signin-admin .contenedorRegistro .row .form .cronometro div span {
						color: ${result.signIn.chronometerColors} !important;
					}
					.MuiFilledInput-underline:hover:before {
						border-bottom: 1px solid ${result.signIn.buttonBackground} !important;
					}
					.MuiFilledInput-underline:focus:before {
						border-bottom: 1px solid ${result.signIn.buttonBackground} !important;
					}
					.MuiFilledInput-underline:before {
						border-bottom: 1px solid ${result.signIn.buttonBackground} !important;
					}
					.MuiFormLabel-root.Mui-focused {
						color: ${result.signIn.buttonBackgroundHover} !important
					}
					.MuiFilledInput-underline:after {
						border-bottom: 1px solid ${result.signIn.buttonBackgroundHover} !important;
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
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		try {
			const reader = new FileReader();
			reader.removeEventListener("load", null);
		} catch (error) {
			console.log(error);
		}
	}, [visible, visibleLogo, visibleBack]);

	const antIcon = <LoadingOutlined spin />;

	const getData = async () => {
		const resp = await getSignInApi();
		if (resp.ok) {
			setStatus(true);
			setAdminOptions({
				...adminOptions,
				title: resp.signIn.title,
				text: resp.signIn.text,
				buttonBackground: resp.signIn.buttonBackground,
				buttonBackgroundHover: resp.signIn.buttonBackgroundHover,
				titlesColors: resp.signIn.titlesColors,
				textsColors: resp.signIn.textsColors,
				chronometerColors: resp.signIn.chronometerColors,
				logo: resp.signIn.logo,
				background: resp.signIn.background,
			});
			setOptionsId(resp.signIn._id);
			if (resp.signIn.logo) {
				const result = await getSignInImageApi(resp.signIn.logo);
				setLogo(result);
				setUpImg1(result);
				const extSplit1 = result.split(".");
				setFileExt1(extSplit1[1]);
				if (resp.signIn.background) {
					const result2 = await getSignInImageApi(
						resp.signIn.background
					);
					setBackground(result2);
					setUpImg2(result2);
					const extSplit2 = result2.split(".");
					setFileExt2(extSplit2[1]);
					setLoading(false);
				} else {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		} else {
			setStatus(false);
			setLoading(false);
		}
	};

	return (
		<>
			{status ? (
				<Button
					className="button-code"
					onClick={() => setVisibleEditor(true)}
				>
					Agregar Código
				</Button>
			) : null}
			<div className="buttons">
				{status ? (
					<div className="buttons-container">
						<div onClick={() => setVisibleLogo(true)}>
							Logo <PictureOutlined />
						</div>
						|
						<div onClick={() => setVisibleBack(true)}>
							Fondo <PictureOutlined />
						</div>
						|
						<div onClick={() => setVisible(true)}>
							Editar <EditOutlined />
						</div>
						{width === "1280px" ? (
							<>
								|
								<div
									onClick={() => {
										setWidth("414px");
										setHeight("736px");
									}}
								>
									Versión móvil <MobileOutlined />
								</div>
							</>
						) : (
							<>
								|
								<div
									onClick={() => {
										setWidth("1280px");
										setHeight("100vh");
									}}
								>
									Versión escritorio <LaptopOutlined />
								</div>
							</>
						)}
					</div>
				) : (
					<div className="buttons-container-edit">
						<div onClick={() => setVisible(true)}>
							Editar <EditOutlined />
						</div>
						{width === "1280px" ? (
							<>
								|
								<div
									onClick={() => {
										setWidth("414px");
										setHeight("736px");
									}}
								>
									Versión móvil <MobileOutlined />
								</div>
							</>
						) : (
							<>
								|
								<div
									onClick={() => {
										setWidth("1280px");
										setHeight("100vh");
									}}
								>
									Versión escritorio <LaptopOutlined />
								</div>
							</>
						)}
					</div>
				)}
			</div>
			<div
				className="max-container-sign-in"
				style={{ maxWidth: width, maxHeight: height, overflowY: "auto" }}
			>
				<Spin
					spinning={loading}
					size="large"
					tip="Cargando..."
					indicator={antIcon}
				>
					<div className="fondo-signin-admin">
						{width === "414px" ? (
							<div
								className="contenedorRegistro"
								style={{ padding: "20px 20px 120px" }}
							>
								<div className="row">
									<div className="form">
										<Resizable
											style={{
												width: `${options.widthLogo}px`,
												height: `${options.heightLogo}px`,
											}}
											ref={ref}
										>
											<img
												src={logo}
												alt="logo"
												className="titulo"
											/>
											<Handle
												cursor={cursor}
												onMouseDown={initResize}
											/>
										</Resizable>
										<div
											dangerouslySetInnerHTML={{
												__html: options.title,
											}}
										/>
										<div
											dangerouslySetInnerHTML={{
												__html: options.text,
											}}
										/>
										{state ? (
											<div className="cronometro">
												<div>
													<h1> </h1>
													<span>Día</span>
												</div>
												<div>
													<h1> </h1>
													<span>Hora</span>
												</div>
												<div>
													<h1> </h1>
													<span>Minutos</span>
												</div>
												<div>
													<h1> </h1>
													<span>Segundos</span>
												</div>
											</div>
										) : null}
										<div div className="card">
											<FormLogin />
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="contenedorRegistro">
								<div className="row">
									<div className="form">
										<Resizable
											style={{
												width: `${options.widthLogo}px`,
												height: `${options.heightLogo}px`,
											}}
											ref={ref}
										>
											<img
												src={logo}
												alt="logo"
												className="titulo"
											/>
											<Handle
												cursor={cursor}
												onMouseDown={initResize}
											/>
										</Resizable>
										<canvas
											ref={previewCanvasRef1}
											crossorigin="anonymous"
											className="titulo hide"
										/>
										<div
											dangerouslySetInnerHTML={{
												__html: options.title,
											}}
										/>
										<div
											dangerouslySetInnerHTML={{
												__html: options.text,
											}}
										/>
										{state ? (
											<div className="cronometro">
												<div>
													<h1> </h1>
													<span>Día</span>
												</div>
												<div>
													<h1> </h1>
													<span>Hora</span>
												</div>
												<div>
													<h1> </h1>
													<span>Minutos</span>
												</div>
												<div>
													<h1> </h1>
													<span>Segundos</span>
												</div>
											</div>
										) : null}
										<div div className="card">
											<FormLogin />
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					{adminOptions.statusCode ? (
						<div className="pane-code-sign-in-admin">
							{parse(`
								<style>${css}</style>
								<body>${html}</body>
								<script>${js}</script>
							`)}
						</div>
					) : null}
				</Spin>
			</div>
			<Drawer
				title="Editar componente"
				width={720}
				closable={false}
				onClose={() => setVisible(false)}
				visible={visible}
				footer={
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Button
							onClick={() => setVisible(false)}
							style={{ marginRight: 8 }}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => setSaveSignIn(true)}
							type="primary"
						>
							Guardar
						</Button>
					</div>
				}
			>
				<DrawerComponent
					token={token}
					save={saveSignIn}
					setSave={setSaveSignIn}
					options={adminOptions}
					setOptions={setAdminOptions}
					optionsId={optionsId}
					status={status}
					reload={reload}
					setReload={setReload}
					setVisible={setVisible}
				/>
			</Drawer>
			<Drawer
				title="Editar Logo"
				width={720}
				closable={false}
				onClose={() => setVisibleLogo(false)}
				visible={visibleLogo}
				footer={
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Button
							onClick={() => setVisibleLogo(false)}
							style={{ marginRight: 8 }}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => setSaveLogo(true)}
							type="primary"
						>
							Guardar
						</Button>
					</div>
				}
			>
				<DrawerLogoComponent
					token={token}
					save={saveLogo}
					setSave={setSaveLogo}
					options={adminOptions}
					setOptions={setAdminOptions}
					optionsId={optionsId}
					status={status}
					reload={reload}
					setReload={setReload}
					setVisible={setVisibleLogo}
					previewCanvasRef1={previewCanvasRef1}
					fileExt={fileExt1}
					setFileExt={setFileExt1}
					upImg={upImg1}
					setUpImg={setUpImg1}
					logo={logo}
					setLogo={setLogo}
				/>
			</Drawer>
			<Drawer
				title="Editar Fondo"
				width={1380}
				closable={false}
				onClose={() => setVisibleBack(false)}
				visible={visibleBack}
				footer={
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Button
							onClick={() => setVisibleBack(false)}
							style={{ marginRight: 8 }}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => setSaveBack(true)}
							type="primary"
						>
							Guardar
						</Button>
					</div>
				}
			>
				<DrawerBackComponent
					token={token}
					save={saveBack}
					setSave={setSaveBack}
					options={adminOptions}
					setOptions={setAdminOptions}
					optionsId={optionsId}
					status={status}
					reload={reload}
					setReload={setReload}
					setVisible={setVisibleBack}
					previewCanvasRef1={previewCanvasRef2}
					fileExt={fileExt2}
					setFileExt={setFileExt2}
					upImg={upImg2}
					setUpImg={setUpImg2}
					background={background}
					setBackground={setBackground}
				/>
			</Drawer>
			<Drawer
				title="Agregar código"
				width={1380}
				closable={false}
				onClose={() => setVisibleEditor(false)}
				visible={visibleEditor}
				footer={
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Button
							onClick={() => setVisibleEditor(false)}
							style={{ marginRight: 8 }}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => setSaveEditor(true)}
							type="primary"
						>
							Guardar
						</Button>
					</div>
				}
			>
				<DrawerEditorComponent
					token={token}
					save={saveEditor}
					setSave={setSaveEditor}
					options={adminOptions}
					setOptions={setAdminOptions}
					optionsId={optionsId}
					status={status}
					reload={reload}
					setReload={setReload}
					setVisible={setVisibleEditor}
					html={html}
					setHtml={setHtml}
					css={css}
					setCss={setCss}
					js={js}
					setJs={setJs}
				/>
			</Drawer>
		</>
	);
};

export default SignInOptions;
