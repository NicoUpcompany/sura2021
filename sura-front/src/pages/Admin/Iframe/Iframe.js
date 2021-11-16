/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
	Form,
	Button,
	Col,
	Row,
	Input,
	notification,
	Spin,
	ConfigProvider,
} from "antd";
import es_ES from "antd/es/locale/es_ES";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router-dom";

import {
	getIframeApi,
	postIframeApi,
	putIframeApi,
} from "../../../api/Admin/iframe";
import { useForm } from "../../../hooks/useForm";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { getAccessTokenApi } from "../../../api/auth";
import Socket from "../../../utils/socket";

import "./Iframe.scss";

const Iframe = () => {
	const history = useHistory();

	const [idIframe, setIdIframe] = useState(null);
	const [state, setState] = useState(false);
	const [loading, setLoading] = useState(false);
	const [values, onChange, setvalues] = useForm({
		link: "",
	});
	const [formValid, inputValidation, setFormValid] = useFormValidation({
		link: false,
	});
	const { link } = values;

	useEffect(() => {
		try {
			setLoading(true);
			let interval;
			const token = getAccessTokenApi();
			if (token === null) {
				history.push("/dashboard/iniciarsesion");
			} else {
				const decodedToken = jwtDecode(token);
				if (decodedToken.role !== "Admin") {
					history.push("/dashboard/iniciarsesion");
				} else {
					const user = {
						id: decodedToken.id,
						route: window.location.pathname,
					};
					Socket.emit("UPDATE_ROUTE", user);
					interval = setInterval(() => {
						getIframe(token);
					}, 5000);
				}
			}
			return () => clearInterval(interval);
		} catch (err) {
			history.push("/dashboard/iniciarsesion");
		}
	}, []);

	const getIframe = async (token) => {
		const resultado = await getIframeApi(token);
		if (resultado.ok) {
			if (resultado.iframe) {
				setState(true);
				setIdIframe(resultado.iframe._id);
				setFormValid({
					...formValid,
					link: true,
				});
				setvalues({
					...values,
					link: resultado.iframe.link,
				});
                setLoading(false);
			} else {
                setLoading(false);
			}
		} else {
            notification["error"]({
                message: resultado.message,
			});
            setLoading(false);
		}
	};

	const putIframe = async () => {
        setLoading(true);
        const token = getAccessTokenApi();
		if (formValid.link) {
			const data = {
				link: link,
			};
			const resultado = await putIframeApi(token, data, idIframe);

			if (resultado.ok) {
				notification["success"]({
					message: resultado.message,
				});
				getIframe(token);
			} else {
				notification["error"]({
					message: resultado.message,
				});
                setLoading(false);
			}
		} else {
            notification["error"]({
                message: "Ingrese el link",
			});
            setLoading(false);
		}
	};

	const postIframe = async () => {
        setLoading(true);
        const token = getAccessTokenApi();
		if (formValid.link) {
			const data = {
				link,
			};
			const resultado = await postIframeApi(token, data);
			if (resultado.ok) {
				notification["success"]({
					message: resultado.message,
				});
				getIframe(token);
			} else {
				notification["error"]({
					message: resultado.message,
				});
                setLoading(false);
			}
		} else {
            notification["error"]({
                message: "Ingrese el link",
			});
            setLoading(false);
		}
	};
	return (
		<ConfigProvider locale={es_ES}>
			<Spin spinning={loading} size="large" tip="Cargando...">
				<div className="iframe">
					<div className="rowTitulo">
						<div className="titulo">
							<h1>Registros de Streaming</h1>
						</div>
					</div>
					<div className="form">
						<Form
							onChange={onChange}
							layout="vertical"
							hideRequiredMark
						>
							<Row gutter={16}>
								<Col span={24}>
									<Input
										placeholder="Ingrese Link"
										type="text"
										name="link"
										id="link"
										value={link}
										onChange={inputValidation}
									/>
								</Col>
							</Row>
						</Form>
						<div className="botones">
							{idIframe !== null ? (
								<Button
									type="primary"
									onClick={() => putIframe()}
								>
									Actualizar
								</Button>
							) : (
								<Button
									type="primary"
									onClick={() => postIframe()}
								>
									Aceptar
								</Button>
							)}
						</div>
						{state ? (
							<div className="botones">
								<iframe
									title="streaming"
									width="560"
									height="315"
									className="transmission"
									src={link}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						) : null}
					</div>
				</div>
			</Spin>
		</ConfigProvider>
	);
};

export default Iframe;
