/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import moment from "moment";
import momentTimezone from "moment-timezone";
import "moment/locale/es";

import Day from "./Day";

import { getAgendaClientApi } from "../../../api/Admin/agenda";
import { getAccessTokenApi } from "../../../api/auth";

import "./Agenda.scss";

const Agenda = (props) => {
	const { agendaTitle, agendaTime, state, setSaveData } = props;
	const array = [];

	const [agendaData, setAgendaData] = useState([]);
	const [day, setDay] = useState(0);

	useEffect(() => {
		const auxToken = getAccessTokenApi();
		if (auxToken !== null) {
			getData(auxToken);
		}
	}, []);

	const getData = async (token) => {
		const resp = await getAgendaClientApi(token);
		if (resp.ok) {
			setAgendaData(resp.agenda);
			activeDay(resp.agenda);
		}
	};

	const activeDay = async (agendaAux) => {
		let activeDay = 0;
		const timeZone = momentTimezone
			.tz(moment(), "America/Santiago")
			.format();
		const date = moment(timeZone).format("DD");
		agendaAux.forEach((element) => {
			let timeZoneAux = momentTimezone
				.tz(
					moment(
						`${element.agenda.year}-${element.agenda.month}-${element.agenda.day}T00:00:00`
					),
					"America/Santiago"
				)
				.format("DD");
			let dateAux = timeZoneAux;
			if (date === dateAux) {
				activeDay = dateAux;
			} else {
				if (activeDay === 0) {
					activeDay = dateAux;
				}
			}
			setDay(activeDay);
		});
		var css = `
		.fondo .contenedorAgenda .days {
			width: calc(100% / ${agendaAux.length});
		}
		.fondo .contenedorAgenda .days button {
			width: 100%
		}`;
		var style = document.createElement("style");

		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		document.getElementsByTagName("head")[0].appendChild(style);
	};

	const abrirCerrar = (raw, flecha) => {
		try {
			const doc = document.getElementById(raw);
			const doc2 = document.getElementById(flecha);
			if (doc.style.display === "none") {
				doc2.style.transform = "rotate(360deg)";
				doc2.style.transitionDuration = "1s";
				doc.style.display = "block";
				doc.style.transitionDuration = "2s";
			} else {
				doc2.style.transform = "rotate(180deg)";
				doc.style.display = "none";
				doc2.style.transitionDuration = "1s";
				doc.style.transitionDuration = "1s";
			}
		} catch (error) {
			console.log("error");
		}
	};

	const Cerrar = (raw, flecha) => {
		if (!array.includes(flecha)) {
			array.push(flecha);
			try {
				let doc, doc2;
				doc = document.getElementById(raw);
				doc2 = document.getElementById(flecha);
				doc2.style.transform = "rotate(180deg)";
				doc.style.display = "none";
				doc2.style.transitionDuration = "1s";
				doc.style.transitionDuration = "1s";
			} catch (error) {
				console.log("error");
			}
		}
	};

	const getFormatDate = (item) => {
		if (item.month.toString().length === 1) {
			if (item.month.toString().length !== 2) {
				item.month = `0${item.month}`;
			}
		}
		if (item.day.toString().length === 1) {
			if (item.day.toString().length !== 2) {
				item.day = `0${item.day}`;
			}
		}
		return capitalize(momentTimezone
			.tz(
				moment(`${item.year}-${item.month}-${item.day}T00:00:00`),
				"America/Santiago"
			)
			.format("dddd"));
	};

	const capitalize = (s) => {
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	}

	return (
		<>
			<div className="contenedorAgenda">
				<div className="tituloAgenda" id="agenda">
					<h1>{agendaTitle}</h1>
				</div>
				{agendaData.map((item, i) => {
					return (
						<div className="days" key={i}>
							<button
								id={`${item.agenda.day}`}
								className={
									item.agenda.day === day ? "clasee" : ""
								}
								onClick={() => setDay(item.agenda.day)}
							>
								{`${getFormatDate(item.agenda)} ${
									item.agenda.day
								}`}
							</button>
						</div>
					);
				})}
				<div className="row4 border">
					<div className="tiempo">
						<p>Tiempo</p>
					</div>
					{/* <div className="duracion">
						<p>Duración</p>
					</div> */}
					<div className="plenario">
						<p>Plenario</p>
					</div>
				</div>
				{agendaData.map((element, i) => {
					return (
						<div key={i}>
							{element.agenda.day === day ? (
								<Day
									setSaveData={setSaveData}
									abrirCerrar={abrirCerrar}
									Cerrar={Cerrar}
									state={state}
									data={element}
									dataID={i}
									agendaTime={agendaTime}
									array={array}
								/>
							) : null}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default Agenda;
