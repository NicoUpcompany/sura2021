/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Collapse, Spin, ConfigProvider } from "antd";
import es_ES from "antd/es/locale/es_ES";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router-dom";

import { getAccessTokenApi } from "../../../api/auth";
import Socket from "../../../utils/socket";

import Iframe from "../Iframe";
// import Colors from "../../../components/Admin/EditComponents/Colors/Colors";
import Acreditacion from "../Accreditation/Accreditation";
import Chronometer from "../Chronometer/Chronometer";
import SignUp from "../../../components/Admin/EditComponents/SignUp/SignUp";
import EventOptions from "../../../components/Admin/EditComponents/EventOptions/EventOptions";
import Networking from "../../../components/Admin/EditComponents/Networking/Networking";
import Confirm from "../../../components/Admin/EditComponents/Confirm/Confirm";
import SignIn from "../../../components/Admin/EditComponents/SignIn/SignIn";
import Agenda from "../../../components/Admin/EditComponents/Agenda/Agenda";
import Talk from "../../../components/Admin/EditComponents/Talk/Talk";
import Expositor from "../../../components/Admin/EditComponents/Expositor/Expositor";
import Stands from "../../../components/Admin/EditComponents/Stands/Stands";
import Buttons from "../../../components/Admin/EditComponents/Buttons/Button";
import WaitingRoom from "../../../components/Admin/EditComponents/WaitingRoom/WaitingRoom";
import Streaming from "../../../components/Admin/EditComponents/Streaming/Streaming";
import Poll from "../../../components/Admin/EditComponents/Poll/Poll";
import PollOption from "../../../components/Admin/EditComponents/PollOption/PollOption";

import "./Components.scss";

const { Panel } = Collapse;

const Components = () => {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [agendaStatus, setAgendaStatus] = useState(0);
	const [standStatus, setStandStatus] = useState(0);
	const [agendaId, setAgendaId] = useState("");
	const [talkId, setTalkId] = useState("");
	const [standId, setStandId] = useState("");
	const [, setButtonId] = useState("");
	const [token, setToken] = useState("");
	const [pollStatus, setPollStatus] = useState(0);
	const [pollId, setPollId] = useState("");

	useEffect(() => {
		try {
			setLoading(true);
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
					setToken(token);
					setLoading(false);
				}
			}
		} catch (err) {
			history.push("/dashboard/iniciarsesion");
		}
	}, []);

	return (
		<ConfigProvider locale={es_ES}>
			<Spin spinning={loading} size="large" tip="Cargando...">
				<div className="components">
					<Collapse accordion>
						<Panel header="General" key="1">
							<Collapse accordion>
								{/* <Panel header="Colores" key="1.1">
									<Colors token={token} />
								</Panel> */}
								<Panel header="Cronómetro" key="1.2">
									<Chronometer token={token} />
								</Panel>
								<Panel header="Acreditación" key="1.3">
									<Acreditacion token={token} />
								</Panel>
								<Panel header="Opciones evento" key="1.4">
									<EventOptions token={token} />
								</Panel>
								<Panel header="Networking" key="1.5">
									<Networking token={token} />
								</Panel>
							</Collapse>
						</Panel>
						<Panel header="Inicio de sesión" className="sign-in-panel" key="2">
							<SignIn token={token} />
						</Panel>
						<Panel header="Registro" key="3">
							<SignUp token={token} />
						</Panel>
						<Panel header="Confirmación" key="4">
							<Confirm token={token} />
						</Panel>
						<Panel header="Sala de espera" key="5">
							<Collapse accordion>
								<Panel header="Configuración" key="5.1">
									<WaitingRoom token={token} />
								</Panel>
								<Panel header="Agenda" key="5.2">
									{agendaStatus === 0 ? (
										<Agenda
											token={token}
											setAgendaStatus={setAgendaStatus}
											setAgendaId={setAgendaId}
										/>
									) : null}
									{agendaStatus === 1 ? (
										<Talk
											token={token}
											setAgendaStatus={setAgendaStatus}
											agendaId={agendaId}
											setTalkId={setTalkId}
										/>
									) : null}
									{agendaStatus === 2 ? (
										<Expositor
											token={token}
											setAgendaStatus={setAgendaStatus}
											talkId={talkId}
										/>
									) : null}
								</Panel>
								<Panel header="Stands" key="5.3">
									{standStatus === 0 ? (
										<Stands
											setStandStatus={setStandStatus}
											setStandId={setStandId}
											token={token}
										/>
									) : null}
									{standStatus === 1 ? (
										<Buttons
											token={token}
											standId={standId}
											setStandStatus={setStandStatus}
											setButtonId={setButtonId}
										/>
									) : null}
								</Panel>
							</Collapse>
						</Panel>
						<Panel header="Streaming" key="6">
							<Collapse accordion>
								<Panel header="Configuración" key="6.1">
									<Streaming token={token} />
								</Panel>
								<Panel header="Encuesta" key="6.2">
									{pollStatus === 0 ? (
										<Poll
											token={token}
											setPollStatus={setPollStatus}
											setPollId={setPollId}
										/>
									) : null}
									{pollStatus === 1 ? (
										<PollOption
											token={token}
											setPollStatus={setPollStatus}
											pollId={pollId}
										/>
									) : null}
								</Panel>
								<Panel header="Iframe" key="6.3">
									<Iframe />
								</Panel>
							</Collapse>
						</Panel>
					</Collapse>
				</div>
			</Spin>
		</ConfigProvider>
	);
};

export default Components;
