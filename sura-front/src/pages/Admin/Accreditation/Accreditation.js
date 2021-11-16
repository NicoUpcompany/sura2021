/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
	Form,
	Button,
	Col,
	Row,
	Input,
	notification,
	Switch,
	Spin,
	Divider,
} from "antd";

import {
	getAccreditationApi,
	postAccreditationApi,
	putAccreditationApi,
} from "../../../api/Admin/accreditation";
import MailingAccreditation from "../../../components/Admin/MailingAccreditation/MailingAccreditation";

import "./Accreditation.scss";

const { TextArea } = Input;

const Acreditacion = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [loadingButton, setLoadingButton] = useState(false);
	const [stateForm, setStateForm] = useState(false);
	const [disabledFullName, setDisabledFullName] = useState(false);
	const [disabledName, setDisabledName] = useState(false);
	const [accreditationId, setAccreditationId] = useState("");
	const [inputs, setInputs] = useState({
		email: true,
		fullName: false,
		name: false,
		lastname: false,
		rut: false,
		enterprise: false,
		position: false,
		phone: false,
		country: false,
		adress: false,
		other: false,
		otherText: "",
		from: "",
		subject: "",
		html: "",
	});

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (inputs.name || inputs.lastname) {
			setDisabledFullName(true);
			setInputs({
				...inputs,
				fullName: false,
			});
		} else {
			setDisabledFullName(false);
		}
	}, [inputs.name, inputs.lastname]);

	useEffect(() => {
		if (inputs.fullName) {
			setDisabledName(true);
			setInputs({
				...inputs,
				name: false,
				lastname: false,
			});
		} else {
			setDisabledName(false);
		}
	}, [inputs.fullName]);

	const getData = async () => {
		const resp = await getAccreditationApi();
		if (!resp.ok) {
			setStateForm(false);
			setLoading(false);
		} else {
			const accreditation = resp.acreditacion;
			setInputs({
				email: accreditation.email,
				fullName: accreditation.fullName,
				name: accreditation.name,
				lastname: accreditation.lastname,
				rut: accreditation.rut,
				enterprise: accreditation.enterprise,
				position: accreditation.position,
				phone: accreditation.phone,
				country: accreditation.country,
				adress: accreditation.adress,
				other: accreditation.other,
				otherText: accreditation.otherText,
				from: accreditation.from,
				subject: accreditation.subject,
				html: accreditation.html,
			});
			setAccreditationId(accreditation._id);
			setStateForm(true);
			setLoading(false);
		}
	};

	const onFinish = async () => {
		setLoadingButton(true);
		if (inputs.other && inputs.otherText.length === 0) {
			notification["error"]({
				message: "El campo otro no debe estar vacío",
			});
			setLoadingButton(false);
		} else if (inputs.from.length === 0 || inputs.subject.length === 0 || inputs.html.length === 0) {
			notification["error"]({
				message: "Los campos de mailing son obligatorios",
			});
			setLoadingButton(false);
		} else {
			if (stateForm) {
				const resp = await putAccreditationApi(
					token,
					inputs,
					accreditationId
				);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					setLoading(true);
					setLoadingButton(false);
					getData(token);
				} else {
					setLoadingButton(false);
					notification["error"]({
						message: resp.message,
					});
				}
			} else {
				const resp = await postAccreditationApi(token, inputs);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					setLoading(true);
					setLoadingButton(false);
					getData(token);
				} else {
					setLoadingButton(false);
					notification["error"]({
						message: resp.message,
					});
				}
			}
		}
	};

	const onChange = (e) => {
		setInputs({
			...inputs,
			subject: e.target.value,
		});
	};

	return (
			<Spin spinning={loading} size="large" tip="Cargando...">
				<div className="accreditation">
					<>
						{stateForm ? (
							<h1>Campos de acreditación</h1>
						) : (
							<h1>
								Aún no se ha subido los ajustes de acreditación
							</h1>
						)}
						<div className="container-form">
							<Form onFinish={onFinish}>
								<Row>
									<Col span={12}>
										<Form.Item label="Correo">
											<Switch
												disabled={true}
												defaultChecked
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										<Form.Item label="Nombre Completo">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														fullName: !inputs.fullName,
													})
												}
												checked={inputs.fullName}
												disabled={disabledFullName}
												name="fullName"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label="Nombre">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														name: !inputs.name,
													})
												}
												checked={inputs.name}
												disabled={disabledName}
												name="name"
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										<Form.Item label="Apellido">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														lastname: !inputs.lastname,
													})
												}
												checked={inputs.lastname}
												disabled={disabledName}
												name="lastname"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label="Rut">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														rut: !inputs.rut,
													})
												}
												checked={inputs.rut}
												name="rut"
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										<Form.Item label="Empresa">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														enterprise: !inputs.enterprise,
													})
												}
												checked={inputs.enterprise}
												name="enterprise"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label="Cargo">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														position: !inputs.position,
													})
												}
												checked={inputs.position}
												name="position"
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										<Form.Item label="Teléfono">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														phone: !inputs.phone,
													})
												}
												checked={inputs.phone}
												name="phone"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label="País">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														country: !inputs.country,
													})
												}
												checked={inputs.country}
												name="country"
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										<Form.Item label="Dirección">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														adress: !inputs.adress,
													})
												}
												checked={inputs.adress}
												name="adress"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item label="Otro">
											<Switch
												onClick={() =>
													setInputs({
														...inputs,
														other: !inputs.other,
													})
												}
												checked={inputs.other}
												name="other"
											/>
										</Form.Item>
									</Col>
									<Col span={12} className="right">
										{inputs.other ? (
											<Form.Item>
												<Input
													value={inputs.otherText}
													allowClear
													placeholder="Campo otro"
													onChange={(e) =>
														setInputs({
															...inputs,
															otherText:
																e.target.value,
														})
													}
													name="otherText"
												/>
											</Form.Item>
										) : null}
									</Col>
								</Row>
								<Divider orientation="left">
									Mailing acreditación
								</Divider>
								<Row>
									<Col span={24}>
										<Form.Item>
											<Input
												addonBefore="Nombre Mailing"
												value={inputs.from}
												allowClear
												onChange={(e) =>
													setInputs({
														...inputs,
														from: e.target.value,
													})
												}
												name="from"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Divider orientation="left" plain>
									Asunto
								</Divider>
								<Row
									style={{
										marginBottom: "30px",
									}}
								>
									<Col span={24}>
										<Form.Item>
											<TextArea
												value={inputs.subject}
												showCount
												allowClear
												maxLength={100}
												onChange={onChange}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row
									style={{
										width: "1250px",
										marginLeft: "-30%",
									}}
								>
									<Col span={24}>
										<MailingAccreditation
											inputs={inputs}
											setInputs={setInputs}
										/>
									</Col>
								</Row>
								<Row>
									<Col span={24}>
										{stateForm ? (
											<Form.Item>
												<Button
													type="primary"
													className="button"
													shape="round"
													htmlType="submit"
													loading={loadingButton}
												>
													Actualizar
												</Button>
											</Form.Item>
										) : (
											<Form.Item>
												<Button
													type="primary"
													className="button"
													shape="round"
													htmlType="submit"
													loading={loadingButton}
												>
													Guardar
												</Button>
											</Form.Item>
										)}
									</Col>
								</Row>
							</Form>
						</div>
					</>
				</div>
			</Spin>
	);
};

export default Acreditacion;
