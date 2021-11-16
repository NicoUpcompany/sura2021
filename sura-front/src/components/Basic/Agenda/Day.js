/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import moment from "moment";
import momentTimezone from "moment-timezone";
import "moment/locale/es";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";

import { basePath, apiVersion } from "../../../api/config";

import flecha from "../../../assets/img/flecha.png";
import footerRegistro from "../../../assets/img/footerRegistro.png";
// import cafe from "../../../assets/img/cafe.png";

const Day = ({
	setSaveData,
	abrirCerrar,
	Cerrar,
	state,
	data,
	dataID,
	agendaTime,
	array,
}) => {
	const [agenda, setAgenda] = useState([]);
	const [status, setStauts] = useState(true);

	useEffect(() => {
		getTime();
	}, [status]);

	useEffect(() => {
		const dataAux = [];
		let css = "";
		data.talk.forEach((item, i) => {
			dataAux.push(item);
			item.expositors.forEach((element, k) => {
				if (element.image.length > 0) {
					const url = `${basePath}/${apiVersion}/expositor-image/${element.image}`;
					css =
						css +
						`
                        .row2 .imagenes .imagen .icon${dataID}${i}${k} {
                            background-image: url(${url});
                            background-position: center center;
                            background-size: cover;
                        }`;
				} else {
					css =
						css +
						`
                        .row2 .imagenes .imagen .icon${dataID}${i}${k} {
                            width: 0 !important;
                        }
                        .row2 .imagenes .imagen .nombrecolaborador {
                            padding: 0 !important;
                            margin: 0 !important;
                        }`;
				}
			});
		});
		var style = document.createElement("style");

		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		document.getElementsByTagName("head")[0].appendChild(style);
		setAgenda(dataAux);
	}, [data]);

	const getTime = () => {
		try {
			const time = data.agenda;
			if (time.month.toString().length === 1) {
				if (time.month.toString().length !== 2) {
					time.month = `0${time.month}`;
				}
			}
			if (time.day.toString().length === 1) {
				if (time.day.toString().length !== 2) {
					time.day = `0${time.day}`;
				}
			}
			let now = agendaTime;
			data.talk.forEach((element, i) => {
				const interval = setInterval(function () {
					const countDownDate = momentTimezone
						.tz(
							moment(
								`${time.year}-${time.month}-${time.day}T${element.talk.hourEnd}:${element.talk.minuteEnd}:00`
							),
							"America/Santiago"
						)
						.valueOf();
					if (
						countDownDate < now &&
						!array.includes(`flecha${dataID}${i}`)
					) {
						clearInterval(interval);
						setStauts(!status);
						Cerrar(`imagen${dataID}${i}`, `flecha${dataID}${i}`);
					}
					now = moment(now).add(1, "seconds").valueOf();
				}, 1000);
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="row2 border" id="row1" style={{ transitionDuration: "1s" }}>
			{agenda.map((item, i) => {
				if (item.talk.break) {
					return (
						<div className="break">
							<div className="tiempo">
								<a>
									<FreeBreakfastIcon className="caffe" />{" "}
									<span>{item.talk.title}</span>
								</a>
							</div>
							{/* <div className="duracion">
								<p>{item.talk.duration} minutos</p>
							</div> */}
						</div>
					);
				} else {
					return (
						<div key={i}>
							<div className="fondoRow">
								<div className="tiempo">
									<p>
										{item.talk.hourStart}:
										{item.talk.minuteStart} <span>-</span>{" "}
										{item.talk.hourEnd}:
										{item.talk.minuteEnd} hrs
									</p>
								</div>
								{/* <div className="duracion">
									<p>{item.talk.duration} minutos</p>
								</div> */}
								<div className="plenario">
									<p className="texto2">
										<img
											src={flecha}
											alt=""
											id={`flecha${dataID}${i}`}
											onClick={() =>
												abrirCerrar(
													`imagen${dataID}${i}`,
													`flecha${dataID}${i}`
												)
											}
										/>
										{state ? null : (
											<a
												onClick={() => setSaveData(3)}
												className="conFondo"
											>
												ENTRAR AL SALÓN{" "}
											</a>
										)}
									</p>
									<p className="texto1">
										<strong>{item.talk.title}</strong>
									</p>
								</div>
							</div>
							<div
								className="imagenes"
								id={`imagen${dataID}${i}`}
							>
								<div className="espacio"></div>
								<div className="imagen">
									{item.expositors.map((element, k) => {
										return (
											<div key={k}>
												{i % 2 === 0 ? (
													<div className="mita2">
														<div
															className={`icon icon${dataID}${i}${k}`}
														></div>
														<div className="nombrecolaborador">
															<span
																style={{
																	textTransform:
																		"capitalize",
																}}
															>
																{element.title}
															</span>
															<br />
															<span>
																<strong>
																	{
																		element.name
																	}
																</strong>
															</span>
															<br />
															<span className="ultimo">
																{
																	element.position
																}
															</span>
															<br />
															<span className="ultimo">
																{" "}
																<strong>
																	{
																		element.enterprise
																	}
																</strong>{" "}
															</span>
														</div>
													</div>
												) : (
													<div className="mita2">
														<div
															className={`icon icon${dataID}${i}${k}`}
														></div>
														<div className="nombrecolaborador">
															<span
																style={{
																	textTransform:
																		"capitalize",
																}}
															>
																{element.title}
															</span>
															<br />
															<span>
																<strong>
																	{
																		element.name
																	}
																</strong>
															</span>
															<br />
															<span className="ultimo">
																{
																	element.position
																}
															</span>
															<br />
															<span className="ultimo">
																{" "}
																<strong>
																	{
																		element.enterprise
																	}
																</strong>{" "}
															</span>
														</div>
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				}
			})}
			{/* <img src={footerRegistro} alt="footerRegistro" className="footerRegistro" /> */}
		</div>
	);
};

export default Day;
