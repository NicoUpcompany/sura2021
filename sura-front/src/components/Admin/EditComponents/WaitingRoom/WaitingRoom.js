/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import AddIcon from "@material-ui/icons/Add";
import { PhotoshopPicker } from "react-color";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
	getWaitingRoomApi,
	getWaitingRoomImageApi,
	postWaitingRoomApi,
	putWaitingRoomApi,
	putUploadHeaderApi,
	putUploadLogoApi,
} from "../../../../api/Admin/waitingRoom";
import {
	getStreamingApi,
} from "../../../../api/Admin/streaming";
import { getNetworkingApi } from "../../../../api/Admin/networking";

import "./WaitingRoom.scss";

const WaitingRoomOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [functionStatus, setStatus] = useState(false);
	const [networkingDisabled, setNetworkingDisabled] = useState(false);
	const [logo, setLogo] = useState(null);
	const [header, setHeader] = useState(null);
	const [optionsId, setOptionsId] = useState("");
	const [options, setOptions] = useState({
		header: "",
		logo: "",
		networking: true,
		status: true,
		agenda: true,
		stand: true,
		headerColor: "default",
		headerTextColor: "default",
		headerTextHoverColor: "default",
		headerChronometerColor: "default",
		buttonColor: "default",
		buttonHoverColor: "default",
		networkingColor: "default",
		networkingText: "Networking",
		networkingTextColor: "default",
		agendaTitleColor: "default",
		agendaHeaderBackground: "default",
		agendaActiveDay: "default",
		agendaDay: "default",
		agendaText: "Agenda",
		standTitle: "Stands",
		standTitleColor: "default",
		footerColor: "default",
	});
	// Crop1
	const [labelInput1, setLabelInput1] = useState("Adjuntar Header");
	const [fileExt1, setFileExt1] = useState("");
	const [upImg1, setUpImg1] = useState();
	const imgRef1 = useRef(null);
	const previewCanvasRef1 = useRef(null);
	const [crop1, setCrop1] = useState({
		unit: "px",
		width: 160,
		height: 70,
	});
	const [completedCrop1, setCompletedCrop1] = useState(null);
	// Crop2
	const [labelInput2, setLabelInput2] = useState("Adjuntar Logo");
	const [fileExt2, setFileExt2] = useState("");
	const [upImg2, setUpImg2] = useState();
	const imgRef2 = useRef(null);
	const previewCanvasRef2 = useRef(null);
	const [crop2, setCrop2] = useState({
		unit: "px",
		width: 1280,
		height: 340,
	});
	const [completedCrop2, setCompletedCrop2] = useState(null);

	useEffect(() => {
		setLoading(true);
		getData();
		getNetworkingConfig();
	}, []);

	useEffect(() => {
		if (header) {
			setOptions({
				...options,
				header: header.file,
			});
		}
	}, [header]);

	useEffect(() => {
		if (logo) {
			setOptions({
				...options,
				logo: logo.file,
			});
		}
	}, [logo]);

	useEffect(() => {
		if (!completedCrop2 || !previewCanvasRef2.current || !imgRef2.current) {
			return;
		}

		const image = imgRef2.current;
		const canvas = previewCanvasRef2.current;
		const crop = completedCrop2;

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext("2d");
		const pixelRatio = window.devicePixelRatio;

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);
		generateFile(previewCanvasRef2.current, setLogo, "logo", fileExt2);
	}, [completedCrop2]);

	useEffect(() => {
		if (!completedCrop1 || !previewCanvasRef1.current || !imgRef1.current) {
			return;
		}

		const image = imgRef1.current;
		const canvas = previewCanvasRef1.current;
		const crop = completedCrop1;

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext("2d");
		const pixelRatio = window.devicePixelRatio;

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);
		generateFile(previewCanvasRef1.current, setHeader, "header", fileExt1);
	}, [completedCrop1]);

	const getData = async () => {
		const resp = await getWaitingRoomApi(token);
		if (resp.ok) {
			setStatus(true);
			setOptions({
				...options,
				networking: resp.waitingRoom.networking,
				status: resp.waitingRoom.status,
				agenda: resp.waitingRoom.agenda,
				stand: resp.waitingRoom.stand,
				header: resp.waitingRoom.header,
				headerColor: resp.waitingRoom.headerColor,
				headerTextColor: resp.waitingRoom.headerTextColor,
				headerTextHoverColor: resp.waitingRoom.headerTextHoverColor,
				headerChronometerColor: resp.waitingRoom.headerChronometerColor,
				networkingColor: resp.waitingRoom.networkingColor,
				networkingText: resp.waitingRoom.networkingText,
				networkingTextColor: resp.waitingRoom.networkingTextColor,
				agendaTitleColor: resp.waitingRoom.agendaTitleColor,
				agendaHeaderBackground: resp.waitingRoom.agendaHeaderBackground,
				agendaActiveDay: resp.waitingRoom.agendaActiveDay,
				agendaDay: resp.waitingRoom.agendaDay,
				agendaText: resp.waitingRoom.agendaText,
				standTitle: resp.waitingRoom.standTitle,
				standTitleColor: resp.waitingRoom.standTitleColor,
				footerColor: resp.waitingRoom.footerColor,
			});
			setOptionsId(resp.waitingRoom._id);
			if (resp.waitingRoom.header.length > 0) {
				const result = await getWaitingRoomImageApi(
					resp.waitingRoom.header
				);
				setHeader(result);
				setUpImg1(result);
				const extSplit1 = result.split(".");
				setFileExt1(extSplit1[1]);
				if (resp.waitingRoom.logo.length > 0) {
					const result2 = await getWaitingRoomImageApi(
						resp.waitingRoom.logo
					);
					setLogo(result2);
					setUpImg2(result2);
					const extSplit2 = result2.split(".");
					setFileExt2(extSplit2[1]);
					setLoading(false);
				} else {
					setLoading(false);
				}
			} else {
				if (resp.waitingRoom.logo.length > 0) {
					const result2 = await getWaitingRoomImageApi(
						resp.waitingRoom.logo
					);
					setLogo(result2);
					setUpImg2(result2);
					const extSplit2 = result2.split(".");
					setFileExt2(extSplit2[1]);
					setLoading(false);
				} else {
					setLoading(false);
				}
			}
		} else {
			setStatus(false);
			setLoading(false);
		}
	};

	const updateWaitingRoom = async () => {
		let optionsUpdate = options;
		setLoading(true);
		if (typeof optionsUpdate.header == "object") {
			if (functionStatus) {
				const resp = await putUploadHeaderApi(
					token,
					optionsUpdate.header,
					optionsId
				);
				if (resp.ok) {
					optionsUpdate.header = resp.header;
					notification["success"]({
						message: "Header actualizado",
					});
					if (typeof optionsUpdate.logo == "object") {
						const result = await putUploadLogoApi(
							token,
							optionsUpdate.logo,
							optionsId
						);
						if (result.ok) {
							optionsUpdate.logo = result.logo;
							notification["success"]({
								message: "Logo actualizado",
							});
							const resp = await putWaitingRoomApi(
								token,
								optionsUpdate,
								optionsId
							);
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
							notification["error"]({
								message: resp.message,
							});
							setLoading(false);
						}
					} else {
						const resp = await putWaitingRoomApi(
							token,
							optionsUpdate,
							optionsId
						);
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
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
				}
			} else {
				const resp = await postWaitingRoomApi(token, options);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const optionsIdAux = resp.waitingRoomId;
					if (typeof optionsUpdate.header == "object") {
						const result = await putUploadHeaderApi(
							token,
							optionsUpdate.header,
							optionsIdAux
						);
						if (result.ok) {
							optionsUpdate.header = resp.header;
							notification["success"]({
								message: "Header actualizado",
							});
							if (typeof optionsUpdate.logo == "object") {
								const result = await putUploadLogoApi(
									token,
									optionsUpdate.logo,
									optionsIdAux
								);
								if (result.ok) {
									optionsUpdate.logo = resp.logo;
									notification["success"]({
										message: "Logo actualizado",
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
		} else if (typeof optionsUpdate.logo == "object") {
			if (functionStatus) {
				const result = await putUploadLogoApi(
					token,
					optionsUpdate.logo,
					optionsId
				);
				if (result.ok) {
					optionsUpdate.logo = result.logo;
					notification["success"]({
						message: "Logo actualizado",
					});
					const resp = await putWaitingRoomApi(
						token,
						optionsUpdate,
						optionsId
					);
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
					notification["error"]({
						message: result.message,
					});
					setLoading(false);
				}
			} else {
				const resp = await postWaitingRoomApi(token, options);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const optionsIdAux = resp.signInId;
					const result = await putUploadLogoApi(
						token,
						optionsUpdate.logo,
						optionsIdAux
					);
					if (result.ok) {
						optionsUpdate.logo = resp.logo;
						notification["success"]({
							message: "Logo actualizado",
						});
						if (typeof optionsUpdate.header == "object") {
							const result = await putUploadHeaderApi(
								token,
								optionsUpdate.header,
								optionsIdAux
							);
							if (result.ok) {
								optionsUpdate.header = resp.header;
								notification["success"]({
									message: "Header actualizado",
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
							message: result.message,
						});
						setLoading(false);
					}
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
				}
			}
		} else {
			if (functionStatus) {
				const resp = await putWaitingRoomApi(
					token,
					optionsUpdate,
					optionsId
				);
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
				const resp = await postWaitingRoomApi(token, options);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const optionsIdAux = resp.waitingRoomId;
					if (typeof optionsUpdate.header == "object") {
						if (functionStatus) {
							const result = await putUploadHeaderApi(
								token,
								optionsUpdate.header,
								optionsIdAux
							);
							if (result.ok) {
								optionsUpdate.header = resp.header;
								notification["success"]({
									message: "Header actualizado",
								});
								if (typeof optionsUpdate.logo == "object") {
									const result = await putUploadLogoApi(
										token,
										optionsUpdate.logo,
										optionsIdAux
									);
									if (result.ok) {
										optionsUpdate.logo = resp.logo;
										notification["success"]({
											message: "Logo actualizado",
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
									message: result.message,
								});
								setLoading(false);
							}
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

	const getNetworkingConfig = async () => {
		const resp = await getNetworkingApi();
		const result = await getStreamingApi(token);
		if (!resp.ok) {
			setNetworkingDisabled(true);
			setOptions({
				...options,
				networking: false,
			});
		} else {
			if (result.ok) {
				if (result.streaming.networking) {
					setNetworkingDisabled(true);
					setOptions({
						...options,
						networking: false,
					});
				}
			}
		}
	};

	const onSelectFile1 = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setLabelInput1(e.target.files[0].name);
			const extSplit = e.target.files[0].name.split(".");
			setFileExt1(extSplit[1]);
			const reader = new FileReader();
			reader.addEventListener("load", () => setUpImg1(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad1 = useCallback((img) => {
		imgRef1.current = img;
	}, []);

	const onSelectFile2 = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setLabelInput2(e.target.files[0].name);
			const extSplit = e.target.files[0].name.split(".");
			setFileExt2(extSplit[1]);
			const reader = new FileReader();
			reader.addEventListener("load", () => setUpImg2(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad2 = useCallback((img) => {
		imgRef2.current = img;
	}, []);

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="waitingroom">
				<Button
					type="primary"
					className="button-page"
					onClick={() =>
						window.open(
							`${window.location.protocol}//${window.location.hostname}${window.location.port || window.location.port === 0 ? (`:${window.location.port}`) : ''}/salaespera`,
							"_blank"
						)
					}
				>
					Ver página <EyeTwoTone />
				</Button>
				{/* <UploadHeader image={header} setImage={setHeader} /> */}
				<h1>
					Logo (160px X 70px) <span className="obligatory">*</span>
				</h1>
				<div>
					<input
						type="file"
						accept="image/png, image/jpeg"
						id="file"
						name="file"
						className="file"
						onChange={onSelectFile2}
					/>
					<label htmlFor="file" className="labelFile">
						{labelInput2}{" "}
						<div>
							<AddIcon className="icon" />
						</div>{" "}
					</label>
				</div>
				<div className="react-crop">
					<ReactCrop
						src={upImg2}
						crossorigin="anonymous"
						onImageLoaded={onLoad2}
						crop={crop2}
						style={{ width: "160px", minWidth: "160px" }}
						onChange={(c) => setCrop2(c)}
						onComplete={(c) => setCompletedCrop2(c)}
					/>
				</div>
				<div className="canvas-container">
					<canvas
						ref={previewCanvasRef2}
						crossorigin="anonymous"
						style={{
							width: 160,
							height: 70,
						}}
					/>
				</div>
				<h1>
					Header (1280px X 340px){" "}
					<span className="obligatory">*</span>
				</h1>
				<div>
					<input
						type="file"
						accept="image/png, image/jpeg"
						id="file2"
						name="file"
						className="file"
						onChange={onSelectFile1}
					/>
					<label htmlFor="file2" className="labelFile">
						{labelInput1}{" "}
						<div>
							<AddIcon className="icon" />
						</div>{" "}
					</label>
				</div>
				<div className="react-crop">
					<ReactCrop
						src={upImg1}
						crossorigin="anonymous"
						onImageLoaded={onLoad1}
						crop={crop1}
						style={{ width: "1280px", minWidth: "1280px" }}
						onChange={(c) => setCrop1(c)}
						onComplete={(c) => setCompletedCrop1(c)}
					/>
				</div>
				<div className="canvas-container">
					<canvas
						ref={previewCanvasRef1}
						crossorigin="anonymous"
						style={{
							width: 1280,
							height: 340,
						}}
					/>
				</div>
				<EditForm
					updateWaitingRoom={updateWaitingRoom}
					options={options}
					setOptions={setOptions}
					completedCrop1={completedCrop1}
					completedCrop2={completedCrop2}
					networkingDisabled={networkingDisabled}
				/>
			</div>
		</Spin>
	);
};

export default WaitingRoomOptions;

// function UploadHeader(props) {
// 	const { image, setImage } = props;
// 	const [imageUrl, setImageUrl] = useState(null);

// 	useEffect(() => {
// 		if (image) {
// 			if (image.preview) {
// 				setImageUrl(image.preview);
// 			} else {
// 				setImageUrl(image);
// 			}
// 		} else {
// 			setImageUrl(null);
// 		}
// 	}, [image]);

// 	const onDrop = useCallback(
// 		(acceptedFiles) => {
// 			const file = acceptedFiles[0];
// 			setImage({ file, preview: URL.createObjectURL(file) });
// 		},
// 		[setImage]
// 	);

// 	const { getRootProps, getInputProps, isDragActive } = useDropzone({
// 		accept: "image/jpeg, image/png",
// 		noKeyboard: true,
// 		onDrop,
// 	});

// 	return (
// 		<div className="upload-avatar" {...getRootProps()}>
// 			<input {...getInputProps()} />
// 			<h1>Header (Click para cambiar)</h1>
// 			{isDragActive ? (
// 				<Avatar size={300} src={"http://placehold.it/1000x1000"} />
// 			) : (
// 				<Avatar
// 					size={300}
// 					src={imageUrl ? imageUrl : "http://placehold.it/1000x1000"}
// 				/>
// 			)}
// 		</div>
// 	);
// }

function EditForm(props) {
	const {
		updateWaitingRoom,
		options,
		setOptions,
		completedCrop1,
		completedCrop2,
		networkingDisabled,
	} = props;

	return (
		<Form className="form-edit" onFinish={updateWaitingRoom}>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.headerColor }}>Color Header</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.headerColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								headerColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.headerTextColor }}>
						Color Texto Menú
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.headerTextColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								headerTextColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.headerTextHoverColor }}>
						Color Texto Menú (Hover)
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.headerTextHoverColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								headerTextHoverColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.headerChronometerColor }}>
						Color Cronómetro
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.headerChronometerColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								headerChronometerColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Botón</h1>
					<Button style={{ background: options.buttonColor }}>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.buttonColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								buttonColor: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Hover Botón</h1>
					<Button style={{ background: options.buttonHoverColor }}>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.buttonHoverColor}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								buttonHoverColor: color.hex,
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
			{options.networking ? (
				<>
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
					<Row justify="space-around">
						<Col span={8}>
							<h1>
								Texto Networking{" "}
								<span className="obligatory">*</span>
							</h1>
						</Col>
						<Col span={8}>
							<Form>
								<Form.Item>
									<Input
										value={options.networkingText}
										allowClear
										placeholder="Texto Networking"
										onChange={(e) =>
											setOptions({
												...options,
												networkingText: e.target.value,
											})
										}
										name="networkingText"
									/>
								</Form.Item>
							</Form>
						</Col>
					</Row>
					{options.networkingText.length > 0 ? (
						<Row justify="space-around" className="colors">
							<Col span={8}>
								<h1
									style={{
										color: options.networkingTextColor,
									}}
								>
									Color Texto Networking
								</h1>
							</Col>
							<Col span={8}>
								<PhotoshopPicker
									color={options.networkingTextColor}
									onChangeComplete={(color) =>
										setOptions({
											...options,
											networkingTextColor: color.hex,
										})
									}
								/>
							</Col>
						</Row>
					) : null}
				</>
			) : null}
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
			<Divider plain>Habilitar Sala espera</Divider>
			<Form.Item>
				<Switch
					checked={options.status}
					onChange={(checked) =>
						setOptions({ ...options, status: checked })
					}
				/>
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					className="btn-submit"
					disabled={
						!completedCrop1?.width ||
						!completedCrop1?.height ||
						!completedCrop2?.width ||
						!completedCrop2?.height
					}
				>
					Guardar
				</Button>
			</Form.Item>
		</Form>
	);
}

function generateFile(canvas, setImage, name, fileExt) {
	if (!canvas) {
		return;
	}

	canvas.toBlob(
		(blob) => {
			const file = new File([blob], `${name}.${fileExt}`);
			setImage({ file, preview: URL.createObjectURL(file) });
		},
		`image/${fileExt}`,
		1
	);
}
