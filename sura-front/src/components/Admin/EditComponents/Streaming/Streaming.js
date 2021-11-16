/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	Button,
	Spin,
	Divider,
	notification,
	Form,
	Switch,
	Row,
	Col,
	Input,
} from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import { PhotoshopPicker } from "react-color";

import {
	getStreamingApi,
	postStreamingApi,
	putStreamingApi,
} from "../../../../api/Admin/streaming";
import {
	getWaitingRoomApi,
} from "../../../../api/Admin/waitingRoom";
import { getNetworkingApi } from "../../../../api/Admin/networking";

import "./Streaming.scss";

const StreamingOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [functionStatus, setStatus] = useState(false);
	const [networkingDisabled, setNetworkingDisabled] = useState(false);
	const [optionsId, setOptionsId] = useState("");
	const [options, setOptions] = useState({
		networking: true,
		status: true,
		agenda: true,
		stand: true,
		botonColor: "default",
		botonHoverColor: "default",
		networkingColor: "default",
		questionBackgroundColor: "default",
		questionTitleColor: "default",
		questionTitle: "Envia aquí tus preguntas o saludos",
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
		getData();
		getNetworkingConfig();
	}, []);

	const getData = async () => {
		const resp = await getStreamingApi(token);
		if (resp.ok) {
			setStatus(true);
			setOptions({
				...options,
				networking: resp.streaming.networking,
				status: resp.streaming.status,
				agenda: resp.streaming.agenda,
				stand: resp.streaming.stand,
				botonColor: resp.streaming.botonColor,
				botonHoverColor: resp.streaming.botonHoverColor,
				networkingColor: resp.streaming.networkingColor,
				questionBackgroundColor: resp.streaming.questionBackgroundColor,
				questionTitleColor: resp.streaming.questionTitleColor,
				questionTitle: resp.streaming.questionTitle,
				agendaTitleColor: resp.streaming.agendaTitleColor,
				agendaHeaderBackground: resp.streaming.agendaHeaderBackground,
				agendaActiveDay: resp.streaming.agendaActiveDay,
				agendaDay: resp.streaming.agendaDay,
				agendaText: resp.streaming.agendaText,
				standTitle: resp.streaming.standTitle,
				standTitleColor: resp.streaming.standTitleColor,
				footerColor: resp.streaming.footerColor,
			});
			setOptionsId(resp.streaming._id);
			setLoading(false);
		} else {
			setStatus(false);
			setLoading(false);
		}
	};

	const updateStreaming = async () => {
		let optionsUpdate = options;
		setLoading(true);
		if (functionStatus) {
			const resp = await putStreamingApi(token, optionsUpdate, optionsId);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				getData();
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
			}
		} else {
			const resp = await postStreamingApi(token, options);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				getData();
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
			}
		}
	};

	const getNetworkingConfig = async () => {
		const resp = await getNetworkingApi();
		const result = await getWaitingRoomApi(token);
		if (!resp.ok) {
			setNetworkingDisabled(true);
			setOptions({
				...options,
				networking: false,
			});
		} else {
			if (result.ok) {
				if (result.waitingRoom.networking) {
					setNetworkingDisabled(true);
					setOptions({
						...options,
						networking: false,
					});
				}
			}
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="streaming">
				<Button
					type="primary"
					className="button-page"
					onClick={() =>
						window.open(
							`${window.location.protocol}//${window.location.hostname}${window.location.port || window.location.port === 0 ? (`:${window.location.port}`) : ''}/streaming`,
							"_blank"
						)
					}
				>
					Ver página <EyeTwoTone />
				</Button>
				<EditForm
					updateStreaming={updateStreaming}
					options={options}
					setOptions={setOptions}
					networkingDisabled={networkingDisabled}
				/>
			</div>
		</Spin>
	);
};

export default StreamingOptions;

function EditForm(props) {
	const { updateStreaming, options, setOptions, networkingDisabled } = props;

	return (
		<Form className="form-edit" onFinish={updateStreaming}>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Botón</h1>
					<Button style={{ background: options.botonColor }}>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.botonColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								botonColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Hover Botón</h1>
					<Button style={{ background: options.botonHoverColor }}>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.botonHoverColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								botonHoverColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.questionBackgroundColor }}>
						Color Fondo Preguntas
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.questionBackgroundColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								questionBackgroundColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around">
				<Col span={8}>
					<h1>
						Título preguntas{" "}
						<span className="obligatory">*</span>
					</h1>
				</Col>
				<Col span={8}>
					<Form>
						<Form.Item>
							<Input
								value={options.questionTitle}
								allowClear
								placeholder="Título preguntas"
								onChange={(e) =>
									setOptions({
										...options,
										questionTitle: e.target.value,
									})
								}
								name="questionTitle"
							/>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.questionTitleColor }}>
						Color Título preguntas
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.questionTitleColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								questionTitleColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Divider plain>Networking</Divider>
			<Form.Item>
				<Switch
					checked={options.networking}
					disabled={networkingDisabled}
					onChange={(checked) =>
						setOptions({ ...options, networking: checked })
					}
				/>
			</Form.Item>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.networkingColor }}>
						Color Networking
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.networkingColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								networkingColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Divider plain>Agenda</Divider>
			<Form.Item>
				<Switch
					checked={options.agenda}
					onChange={(checked) =>
						setOptions({ ...options, agenda: checked })
					}
				/>
			</Form.Item>
			{options.agenda ? (
				<>
					<Row justify="space-around">
						<Col span={8}>
							<h1>
								Título Agenda
								<span className="obligatory">*</span>
							</h1>
						</Col>
						<Col span={8}>
							<Form>
								<Form.Item>
									<Input
										value={options.agendaText}
										allowClear
										placeholder="Título Agenda"
										onChange={(e) =>
											setOptions({
												...options,
												agendaText: e.target.value,
											})
										}
										name="agendaText"
									/>
								</Form.Item>
							</Form>
						</Col>
					</Row>
					{options.agendaText.length > 0 ? (
						<Row justify="space-around" className="colors">
							<Col span={8}>
								<h1
									style={{
										color: options.agendaTitleColor,
									}}
								>
									Color Título Agenda
								</h1>
							</Col>
							<Col span={8}>
								<PhotoshopPicker
									color={options.agendaTitleColor}
									onChangeComplete={(color) =>
										setOptions({
											...options,
											agendaTitleColor: color.hex,
										})
									}
								/>
							</Col>
						</Row>
					) : null}
					<Row justify="space-around" className="colors">
						<Col span={8}>
							<h1
								style={{
									color: options.agendaHeaderBackground,
								}}
							>
								Color header Agenda
							</h1>
						</Col>
						<Col span={8}>
							<PhotoshopPicker
								color={options.agendaHeaderBackground}
								onChangeComplete={(color) =>
									setOptions({
										...options,
										agendaHeaderBackground: color.hex,
									})
								}
							/>
						</Col>
					</Row>
					<Row justify="space-around" className="colors">
						<Col span={8}>
							<h1
								style={{
									color: options.agendaActiveDay,
								}}
							>
								Color Día activo
							</h1>
						</Col>
						<Col span={8}>
							<PhotoshopPicker
								color={options.agendaActiveDay}
								onChangeComplete={(color) =>
									setOptions({
										...options,
										agendaActiveDay: color.hex,
									})
								}
							/>
						</Col>
					</Row>
					<Row justify="space-around" className="colors">
						<Col span={8}>
							<h1
								style={{
									color: options.agendaDay,
								}}
							>
								Color Texto Día
							</h1>
						</Col>
						<Col span={8}>
							<PhotoshopPicker
								color={options.agendaDay}
								onChangeComplete={(color) =>
									setOptions({
										...options,
										agendaDay: color.hex,
									})
								}
							/>
						</Col>
					</Row>
				</>
			) : null}
			<Divider plain>Stands</Divider>
			<Form.Item>
				<Switch
					checked={options.stand}
					onChange={(checked) =>
						setOptions({ ...options, stand: checked })
					}
				/>
			</Form.Item>
			{options.stand ? (
				<>
					<Row justify="space-around">
						<Col span={8}>
							<h1>
								Título Stand
								<span className="obligatory">*</span>
							</h1>
						</Col>
						<Col span={8}>
							<Form>
								<Form.Item>
									<Input
										value={options.standTitle}
										allowClear
										placeholder="Título Stands"
										onChange={(e) =>
											setOptions({
												...options,
												standTitle: e.target.value,
											})
										}
										name="standTitle"
									/>
								</Form.Item>
							</Form>
						</Col>
					</Row>
					{options.standTitle.length > 0 ? (
						<Row justify="space-around" className="colors">
							<Col span={8}>
								<h1
									style={{
										color: options.standTitleColor,
									}}
								>
									Color Título Stand
								</h1>
							</Col>
							<Col span={8}>
								<PhotoshopPicker
									color={options.standTitleColor}
									onChangeComplete={(color) =>
										setOptions({
											...options,
											standTitleColor: color.hex,
										})
									}
								/>
							</Col>
						</Row>
					) : null}
				</>
			) : null}
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.footerColor }}>Color Pie de página</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.footerColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								footerColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Divider plain>Habilitar Streaming</Divider>
			<Form.Item>
				<Switch
					checked={options.status}
					onChange={(checked) =>
						setOptions({ ...options, status: checked })
					}
				/>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit" className="btn-submit">
					Guardar
				</Button>
			</Form.Item>
		</Form>
	);
}
