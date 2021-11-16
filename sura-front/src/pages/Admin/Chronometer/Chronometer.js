/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Space, notification, Spin } from "antd";
import moment from "moment";
import "moment/locale/es";

import {
	postChronometerApi,
	getChronometerApi,
	putChronometerApi,
} from "../../../api/Admin/chronometer";

import "./Chronometer.scss";

const Cronometro = (props) => {
	const { token } = props;

	const [Fecha, setFecha] = useState();
	const [state, setState] = useState(false);
	const [idFecha, setIdFecha] = useState("");
	const [titulo, setTitulo] = useState("");
	const [titulo2, setTitulo2] = useState("");
	const [loading, setLoading] = useState(false);

	function onOk(value) {
		setFecha(value);
	}

	useEffect(() => {
		setLoading(true);
		const interval = setInterval(() => {
			listarFecha();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const listarFecha = async () => {
		const resultado = await getChronometerApi();
		const time = moment(resultado.eventTime).add(4, "hours").format();
		const hora = moment(time).format("LTS");
		const dia = moment(time).format("L");
		setTitulo(dia);
		setTitulo2(hora);
		if (resultado.ok) {
			setIdFecha(resultado.timeId);
		}
		setState(resultado.ok);
		setLoading(false);
	};

	const seleccionarFecha = async () => {
		setLoading(true);
		if (Fecha) {
			const mes2 = Fecha._d.getMonth();
			const data = {
				day: Fecha._d.getDate(),
				month: mes2,
				year: Fecha._d.getFullYear(),
				hour: Fecha._d.getHours(),
				minute: Fecha._d.getMinutes(),
				second: Fecha._d.getSeconds(),
			};
			const resultado = await postChronometerApi(token, data);
			if (resultado.ok) {
				setFecha("");
				listarFecha();
				notification["success"]({
					message: resultado.message,
				});
			} else {
				notification["error"]({
					message: resultado.message,
				});
				setLoading(false);
			}
		} else {
			notification["error"]({
				message: "Seleccione fecha",
			});
			setLoading(false);
		}
	};
	const actualizarFecha = async () => {
		setLoading(true);
		if (Fecha) {
			const mes2 = Fecha._d.getMonth();
			const data = {
				day: Fecha._d.getDate(),
				month: mes2,
				year: Fecha._d.getFullYear(),
				hour: Fecha._d.getHours(),
				minute: Fecha._d.getMinutes(),
				second: Fecha._d.getSeconds(),
			};
			const resultado = await putChronometerApi(token, data, idFecha);
			if (resultado.ok) {
				setFecha("");
				listarFecha();
				notification["success"]({
					message: resultado.message,
				});
			} else {
				notification["error"]({
					message: resultado.message,
				});
				setLoading(false);
			}
		} else {
			notification["error"]({
				message: "Seleccione fecha",
			});
			setLoading(false);
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="chronometer">
				<div className="data">
					{state ? (
						<div className="card">
							<h2>
								Fecha del evento : {titulo} - {titulo2}
							</h2>
							<h1>¿Deseas actualizar la fecha del evento?</h1>
							<div>
								<Space direction="vertical" size={12}>
									<DatePicker showTime onOk={onOk} />
								</Space>
								<button onClick={() => actualizarFecha()}>
									Actualizar
								</button>
							</div>
						</div>
					) : (
						<div className="card">
							<h2>
								Aún no hay una fecha registrada para el inicio
								del evento.
							</h2>
							<h1>¡Selecciona la fecha de inicio del evento!</h1>
							<div>
								<Space direction="vertical" size={12}>
									<DatePicker showTime onOk={onOk} />
								</Space>
								<button onClick={() => seleccionarFecha()}>
									Seleccionar
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</Spin>
	);
};

export default Cronometro;
