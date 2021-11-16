/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import {
	Button,
	Spin,
	Row,
	Col,
	notification,
	Form,
	Input,
	Select,
	Avatar,
} from "antd";
import { useDropzone } from "react-dropzone";

import {
	getEventOptionsApi,
	postEventOptionsApi,
	putEventOptionsApi,
	putUploadFaviconApi,
	getEventOptionFaviconApi
} from "../../../../api/Admin/eventOptions";

import "./EventOptions.scss";

const { Option } = Select;

const EventOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [state, setState] = useState(false);
	const [eventOptionsId, setEventOptionsId] = useState("");
	const [favicon, setFavicon] = useState(null);
	const [data, setData] = useState({
		title: "",
		description: "",
		favicon: "",
		ga: "",
		index: "signUp",
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	useEffect(() => {
		if (favicon) {
			setData({
				...data,
				favicon: favicon.file,
			});
		}
	}, [favicon]);

	const getData = async () => {
		const resp = await getEventOptionsApi();
		if (resp.ok) {
			setEventOptionsId(resp.optionsEvent._id);
			setData({
				title: resp.optionsEvent.title,
				description: resp.optionsEvent.description,
				index: resp.optionsEvent.index,
				ga: resp.optionsEvent.ga,
			});
			if (resp.optionsEvent.favicon.length > 0) {
				const result = await getEventOptionFaviconApi(resp.optionsEvent.favicon);
				setFavicon(result);
				setLoading(false);
			} else {
				setLoading(false);
			}
			setState(true);
		} else {
			setState(false);
			setLoading(false);
		}
	};

	const saveOrUpdateOptions = async () => {
		setLoading(true);
		if (data.title.trim().length === 0) {
			notification["error"]({
				message: "Ingrese un título válido",
			});
			setLoading(false);
		} else if(data.description.trim().length === 0) {
			notification["error"]({
				message: "Ingrese una descripción válida",
			});
			setLoading(false);
		} else {
			if (state) {
				const faviconAux = data.favicon;
				const sendData = {
					...data,
					favicon: "",
				}
				const resp = await putEventOptionsApi(
					token,
					sendData,
					eventOptionsId
				);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					if (typeof faviconAux == "object") {
						const result = await putUploadFaviconApi(
							token,
							faviconAux,
							eventOptionsId
						);
						if (result.ok) {
							data.favicon = result.favicon;
							notification["success"]({
								message: "Favicon actualizado",
							});
							getData();
						} else {
							notification["error"]({
								message: result.message,
							});
							setLoading(false);
						}
					} else {
						getData();
					}
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
				}
			} else {
				const sendData = {
					...data,
					favicon: "",
				}
				const resp = await postEventOptionsApi(token, sendData);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const optionsEventIdAux = resp.optionsEventId;
					if (typeof data.favicon == "object") {
						const result = await putUploadFaviconApi(
							token,
							data.favicon,
							optionsEventIdAux
						);
						if (result.ok) {
							data.favicon = result.favicon;
							notification["success"]({
								message: "Favicon creado",
							});
							getData();
						} else {
							notification["error"]({
								message: result.message,
							});
							setLoading(false);
						}
					} else {
						getData();
					}
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
				}
			}
		}
	};

	function onChange(value) {
		setData({
			...data,
			index: value,
		});
	}

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="event-options">
			<Row justify="space-around">
					<Col span={8}>
						<h1>Título evento</h1>
					</Col>
					<Col span={8}>
						<Form>
							<Form.Item>
								<Input
									value={data.title}
									allowClear
									placeholder="Título"
									onChange={(e) =>
										setData({
											...data,
											title: e.target.value,
										})
									}
									name="title"
								/>
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row justify="space-around">
					<Col span={8}>
						<h1>Descripción</h1>
					</Col>
					<Col span={8}>
						<Form>
							<Form.Item>
								<Input
									value={data.description}
									allowClear
									placeholder="Descripción"
									onChange={(e) =>
										setData({
											...data,
											description: e.target.value,
										})
									}
									name="description"
								/>
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row justify="space-around">
					<Col span={8}>
						<h1>ID medición Google Analytics</h1>
					</Col>
					<Col span={8}>
						<Form>
							<Form.Item>
								<Input
									value={data.ga}
									allowClear
									placeholder="ID de medición"
									onChange={(e) =>
										setData({
											...data,
											ga: e.target.value,
										})
									}
									name="ga"
								/>
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row justify="space-around">
					<Col span={8}>
						<h1>Favicon</h1>
					</Col>
					<Col span={8}>
						<UploadImage image={favicon} setImage={setFavicon} />
					</Col>
				</Row>
				<Row justify="space-around">
					<Col span={8}>
						<h1>Index</h1>
					</Col>
					<Col span={8}>
						<Select
							showSearch
                            defaultValue={data.index}
							style={{ width: '100%' }}
							placeholder="Selecciona un index"
							optionFilterProp="children"
							onChange={onChange}
							filterOption={(input, option) =>
								option.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="signUp">Registro</Option>
							<Option value="signIn">Inicio de sesión</Option>
						</Select>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Button
							type="primary"
							className="button"
							shape="round"
							htmlType="submit"
							onClick={() => saveOrUpdateOptions()}
						>
							{state ? (
								<span>Actualizar</span>
							) : (
								<span>Guardar</span>
							)}
						</Button>
					</Col>
				</Row>
			</div>
		</Spin>
	);
};

export default EventOptions;

function UploadImage(props) {
	const { image, setImage } = props;
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (image) {
			if (image.preview) {
				setImageUrl(image.preview);
			} else {
				setImageUrl(image);
			}
		} else {
			setImageUrl(null);
		}
	}, [image]);

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			setImage({ file, preview: URL.createObjectURL(file) });
		},
		[setImage]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: "image/jpeg, image/png",
		noKeyboard: true,
		onDrop,
	});

	return (
		<div className="upload-avatar" {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<Avatar size={100} src={"http://placehold.it/16x16"} />
			) : (
				<Avatar
					size={100}
					src={imageUrl ? imageUrl : "http://placehold.it/16x16"}
				/>
			)}
		</div>
	);
}
