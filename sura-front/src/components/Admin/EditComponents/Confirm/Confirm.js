/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Spin, Row, Col, notification, Form, Input } from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import AddIcon from "@material-ui/icons/Add";
import { PhotoshopPicker } from "react-color";
import ReactCrop from "react-image-crop";

import {
	getConfirmApi,
	getConfirmImageApi,
	postConfirmApi,
	putConfirmApi,
	putUploadLogoApi,
	putUploadBackgroundApi,
} from "../../../../api/Admin/confirm";

import "./Confirm.scss";

const ConfirmOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(false);
	const [logo, setLogo] = useState(null);
	const [background, setBackground] = useState(null);
	const [optionsId, setOptionsId] = useState("");
	const [options, setOptions] = useState({
		text: "",
		logo: "",
		background: "",
		buttonBackground: "default",
		buttonBackgroundHover: "default",
		titlesColors: "default",
		textsColors: "default",
		icons: "default",
	});
	// Crop1
	const [labelInput1, setLabelInput1] = useState("Adjuntar logo");
	const [fileExt1, setFileExt1] = useState("");
	const [upImg1, setUpImg1] = useState();
	const imgRef1 = useRef(null);
	const previewCanvasRef1 = useRef(null);
	const [crop1, setCrop1] = useState({
		unit: "px",
		width: 420,
		height: 120,
	});
	const [completedCrop1, setCompletedCrop1] = useState(null);
	// Crop2
	const [labelInput2, setLabelInput2] = useState("Adjuntar fondo");
	const [fileExt2, setFileExt2] = useState("");
	const [upImg2, setUpImg2] = useState();
	const imgRef2 = useRef(null);
	const previewCanvasRef2 = useRef(null);
	const [crop2, setCrop2] = useState({
		unit: "px",
		width: 1280,
		height: 800,
	});
	const [completedCrop2, setCompletedCrop2] = useState(null);

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	useEffect(() => {
		if (logo) {
			setOptions({
				...options,
				logo: logo.file,
			});
		}
	}, [logo]);

	useEffect(() => {
		if (background) {
			setOptions({
				...options,
				background: background.file,
			});
		}
	}, [background]);

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
		generateFile(previewCanvasRef1.current, setLogo, "logo", fileExt1);
	}, [completedCrop1]);

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
		generateFile(
			previewCanvasRef2.current,
			setBackground,
			"background",
			fileExt2
		);
	}, [completedCrop2]);

	const getData = async () => {
		const resp = await getConfirmApi();
		if (resp.ok) {
			setStatus(true);
			setOptions({
				...options,
				text: resp.confirm.text,
				buttonBackground: resp.confirm.buttonBackground,
				buttonBackgroundHover: resp.confirm.buttonBackgroundHover,
				titlesColors: resp.confirm.titlesColors,
				textsColors: resp.confirm.textsColors,
				icons: resp.confirm.icons,
			});
			setOptionsId(resp.confirm._id);
			if (resp.confirm.logo.length > 0) {
				const result = await getConfirmImageApi(resp.confirm.logo);
				setLogo(result);
				setUpImg1(result);
				const extSplit1 = result.split(".");
				setFileExt1(extSplit1[1]);
				if (resp.confirm.background.length > 0) {
					const result2 = await getConfirmImageApi(
						resp.confirm.background
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

	const updateConfirm = async () => {
		if (options.text.trim().length === 0) {
			notification["error"]({
				message: "El campo texto es obligatorio",
			});
		} else {
			let optionsUpdate = options;
			setLoading(true);
			if (typeof optionsUpdate.logo == "object") {
				if (status) {
					const resp = await putUploadLogoApi(
						token,
						optionsUpdate.logo,
						optionsId
					);
					if (resp.ok) {
						optionsUpdate.logo = resp.logo;
						notification["success"]({
							message: "Logo actualizado",
						});
						if (typeof optionsUpdate.background == "object") {
							const resp = await putUploadBackgroundApi(
								token,
								optionsUpdate.background,
								optionsId
							);
							if (resp.ok) {
								optionsUpdate.background = resp.background;
								notification["success"]({
									message: "Fondo actualizado",
								});
								const response = await putConfirmApi(
									token,
									optionsUpdate,
									optionsId
								);
								if (response.ok) {
									notification["success"]({
										message: response.message,
									});
									getData();
								} else {
									notification["error"]({
										message: response.message,
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
							const response = await putConfirmApi(
								token,
								optionsUpdate,
								optionsId
							);
							if (response.ok) {
								notification["success"]({
									message: response.message,
								});
								getData();
							} else {
								notification["error"]({
									message: response.message,
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
					const resp = await postConfirmApi(token, options);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const optionsIdAux = resp.confirmId;
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
							if (typeof optionsUpdate.background == "object") {
								const result = await putUploadBackgroundApi(
									token,
									optionsUpdate.background,
									optionsIdAux
								);
								if (result.ok) {
									optionsUpdate.background = resp.background;
									notification["success"]({
										message: "Fondo actualizado",
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
			} else if (typeof optionsUpdate.background == "object") {
				const resp = await putUploadBackgroundApi(
					token,
					optionsUpdate.background,
					optionsId
				);
				if (resp.ok) {
					optionsUpdate.background = resp.background;
					notification["success"]({
						message: "Fondo actualizado",
					});
					const response = await putConfirmApi(
						token,
						optionsUpdate,
						optionsId
					);
					if (response.ok) {
						notification["success"]({
							message: response.message,
						});
						getData();
					} else {
						notification["error"]({
							message: response.message,
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
				if (status) {
					const resp = await putConfirmApi(
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
					const resp = await postConfirmApi(token, options);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const optionsIdAux = resp.confirmId;
						if (typeof optionsUpdate.logo == "object") {
							if (status) {
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
									if (
										typeof optionsUpdate.background ==
										"object"
									) {
										const result = await putUploadBackgroundApi(
											token,
											optionsUpdate.background,
											optionsIdAux
										);
										if (result.ok) {
											optionsUpdate.background =
												resp.background;
											notification["success"]({
												message: "Fondo actualizado",
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
			<div className="confirm">
				<Button
					type="primary"
					className="button-page"
					onClick={() =>
						window.open(
							`${window.location.protocol}//${window.location.hostname}${window.location.port || window.location.port === 0 ? (`:${window.location.port}`) : ''}/confirmacion`,
							"_blank"
						)
					}
				>
					Ver página <EyeTwoTone />
				</Button>
				{/* <UploadLogo image={logo} setImage={setLogo} />
				<UploadBackground image={background} setImage={setBackground} /> */}
				<h1>
					Logo (420px X 120px) <span className="obligatory">*</span>
				</h1>
				<div>
					<input
						type="file"
						accept="image/png, image/jpeg"
						id="file"
						name="file"
						className="file"
						onChange={onSelectFile1}
					/>
					<label htmlFor="file" className="labelFile">
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
						style={{ width: "420px", minWidth: "420px" }}
						onChange={(c) => setCrop1(c)}
						onComplete={(c) => setCompletedCrop1(c)}
					/>
				</div>
				<div className="canvas-container">
					<canvas
						ref={previewCanvasRef1}
						crossorigin="anonymous"
						style={{
							width: 420,
							height: 120,
						}}
					/>
				</div>
				<h1>
					Fondo (1280px X 800px) <span className="obligatory">*</span>
				</h1>
				<div>
					<input
						type="file"
						accept="image/png, image/jpeg"
						id="file2"
						name="file"
						className="file"
						onChange={onSelectFile2}
					/>
					<label htmlFor="file2" className="labelFile">
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
						style={{ width: "1280px", minWidth: "1280px" }}
						onChange={(c) => setCrop2(c)}
						onComplete={(c) => setCompletedCrop2(c)}
					/>
				</div>
				<div className="canvas-container">
					<canvas
						ref={previewCanvasRef2}
						crossorigin="anonymous"
						style={{
							width: 1280,
							height: 800,
						}}
					/>
				</div>
				<EditForm
					updateConfirm={updateConfirm}
					options={options}
					setOptions={setOptions}
					completedCrop1={completedCrop1}
					completedCrop2={completedCrop2}
				/>
			</div>
		</Spin>
	);
};

export default ConfirmOptions;

// function UploadLogo(props) {
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
// 			<h1>Logo (Click para cambiar)</h1>
// 			{isDragActive ? (
// 				<Avatar size={200} src={"http://placehold.it/1000x1000"} />
// 			) : (
// 				<Avatar
// 					size={200}
// 					src={imageUrl ? imageUrl : "http://placehold.it/1000x1000"}
// 				/>
// 			)}
// 		</div>
// 	);
// }

// function UploadBackground(props) {
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
// 			<h1>Fondo (Click para cambiar)</h1>
// 			{isDragActive ? (
// 				<Avatar size={500} src={"http://placehold.it/1000x1000"} />
// 			) : (
// 				<Avatar
// 					size={500}
// 					src={imageUrl ? imageUrl : "http://placehold.it/1000x1000"}
// 				/>
// 			)}
// 		</div>
// 	);
// }

function EditForm(props) {
	const {
		updateConfirm,
		options,
		setOptions,
		completedCrop1,
		completedCrop2,
	} = props;

	return (
		<Form className="form-edit" onFinish={updateConfirm}>
			<Row justify="space-around">
				<Col span={8}>
					<h1>
						Título <span className="obligatory">*</span>
					</h1>
				</Col>
				<Col span={8}>
					<Form>
						<Form.Item>
							<Input
								value={options.text}
								allowClear
								placeholder="Texto"
								onChange={(e) =>
									setOptions({
										...options,
										text: e.target.value,
									})
								}
								name="text"
							/>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			{options.text.length > 0 ? (
				<Row justify="space-around" className="colors">
					<Col span={8}>
						<h1 style={{ color: options.titlesColors }}>
							Color Título
						</h1>
					</Col>
					<Col span={8}>
						<PhotoshopPicker
							color={options.titlesColors}
							onChangeComplete={(color) =>
								setOptions({
									...options,
									titlesColors: color.hex,
								})
							}
						/>
					</Col>
				</Row>
			) : null}
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.textsColors }}>Color texto</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.textsColors}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								textsColors: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Botón</h1>
					<Button style={{ background: options.buttonBackground }}>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.buttonBackground}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								buttonBackground: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1>Color Hover Botón</h1>
					<Button
						style={{ background: options.buttonBackgroundHover }}
					>
						Botón
					</Button>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.buttonBackgroundHover}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								buttonBackgroundHover: color.hex,
							})
						}
					/>
				</Col>
			</Row>
			<Row justify="space-around" className="colors">
				<Col span={8}>
					<h1 style={{ color: options.icons }}>
						Color iconos
					</h1>
				</Col>
				<Col span={8}>
					<PhotoshopPicker
						color={options.icons}
						onChangeComplete={(color) =>
							setOptions({
								...options,
								icons: color.hex,
							})
						}
					/>
				</Col>
			</Row>
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
					Actualizar
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
