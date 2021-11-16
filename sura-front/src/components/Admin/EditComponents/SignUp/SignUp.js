/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Spin, Row, Col, notification, Form, Input } from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import AddIcon from "@material-ui/icons/Add";
import { PhotoshopPicker } from "react-color";
import { Editor } from "@tinymce/tinymce-react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
	getSignUpApi,
	getSignUpImageApi,
	postSignUpApi,
	putSignUpApi,
	putUploadImageApi,
} from "../../../../api/Admin/signUp";

import "./SignUp.scss";

const { TextArea } = Input;

const SignUpOptions = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(false);
	const [image, setImage] = useState(null);
	const [optionsId, setOptionsId] = useState("");
	const [labelInput, setLabelInput] = useState("Adjuntar imagen");
	const [fileExt, setFileExt] = useState("");
	const [options, setOptions] = useState({
		title: "",
		description: "",
		image: "",
		buttonBackground: "default",
		buttonBackgroundHover: "default",
		titlesColors: "default",
		textsColors: "default",
	});
	// Crop
	const [upImg, setUpImg] = useState();
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [crop, setCrop] = useState({
		unit: "px",
		width: 630,
		height: 650,
	});
	const [completedCrop, setCompletedCrop] = useState(null);

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	useEffect(() => {
		if (image) {
			setOptions({
				...options,
				image: image.file,
			});
		}
	}, [image]);

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current;
		const canvas = previewCanvasRef.current;
		const crop = completedCrop;

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
		generateFile(previewCanvasRef.current, setImage, "image", fileExt);
	}, [completedCrop]);

	const getData = async () => {
		const resp = await getSignUpApi();
		if (resp.ok) {
			setStatus(true);
			setOptions({
				...options,
				title: resp.signUp.title,
				description: resp.signUp.description,
				buttonBackground: resp.signUp.buttonBackground,
				buttonBackgroundHover: resp.signUp.buttonBackgroundHover,
				titlesColors: resp.signUp.titlesColors,
				textsColors: resp.signUp.textsColors,
			});
			setOptionsId(resp.signUp._id);
			if (resp.signUp.image.length > 0) {
				const result = await getSignUpImageApi(resp.signUp.image);
				setImage(result);
				setUpImg(result);
				setLoading(false);
			} else {
				setLoading(false);
			}
		} else {
			setStatus(false);
			setLoading(false);
		}
	};

	const updateSignUp = async () => {
		if (options.title.trim().length === 0) {
			notification["error"]({
				message: "Todos los campos son obligatorios",
			});
		} else {
			let optionsUpdate = options;
			setLoading(true);
			if (typeof optionsUpdate.image == "object") {
				if (status) {
					const resp = await putUploadImageApi(
						token,
						optionsUpdate.image,
						optionsId
					);
					if (resp.ok) {
						optionsUpdate.image = resp.image;
						notification["success"]({
							message: "Imagen actualizada",
						});
						const result = await putSignUpApi(
							token,
							optionsUpdate,
							optionsId
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
							getData();
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
				} else {
					const resp = await postSignUpApi(token, options);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const optionsIdAux = resp.signUpId;
						const result = await putUploadImageApi(
							token,
							optionsUpdate.image,
							optionsIdAux
						);
						if (result.ok) {
							optionsUpdate.image = resp.image;
							notification["success"]({
								message: "Imagen actualizada",
							});
							getData();
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
				if (status) {
					const resp = await putSignUpApi(
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
					const resp = await postSignUpApi(token, options);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const optionsIdAux = resp.signUpId;
						if (typeof optionsUpdate.image == "object") {
							if (status) {
								const result = await putUploadImageApi(
									token,
									optionsUpdate.image,
									optionsIdAux
								);
								if (result.ok) {
									optionsUpdate.image = resp.image;
									notification["success"]({
										message: "Imagen actualizada",
									});
									getData();
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

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setLabelInput(e.target.files[0].name);
			const extSplit = e.target.files[0].name.split(".");
			setFileExt(extSplit[1]);
			const reader = new FileReader();
			reader.addEventListener("load", () => setUpImg(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="signup">
				<Button
					type="primary"
					className="button-page"
					onClick={() =>
						window.open(
							`${window.location.protocol}//${
								window.location.hostname
							}${
								window.location.port ||
								window.location.port === 0
									? `:${window.location.port}`
									: ""
							}/registro`,
							"_blank"
						)
					}
				>
					Ver página <EyeTwoTone />
				</Button>
				{/* <UploadImage image={image} setImage={setImage} /> */}
				<h1>
					Imagen registro (630px X 650px){" "}
					<span className="obligatory">*</span>
				</h1>
				<div>
					<input
						type="file"
						accept="image/png, image/jpeg"
						id="file"
						name="file"
						className="file"
						onChange={onSelectFile}
					/>
					<label htmlFor="file" className="labelFile">
						{labelInput}{" "}
						<div>
							<AddIcon className="icon" />
						</div>{" "}
					</label>
				</div>
				<div className="react-crop">
					<ReactCrop
						src={upImg}
						crossorigin="anonymous"
						onImageLoaded={onLoad}
						crop={crop}
						style={{ width: "630px", minWidth: "630px" }}
						onChange={(c) => setCrop(c)}
						onComplete={(c) => setCompletedCrop(c)}
					/>
				</div>
				<div className="canvas-container">
					<canvas
						ref={previewCanvasRef}
						crossorigin="anonymous"
						style={{
							width: 630,
							height: 650,
						}}
					/>
				</div>
				{/* <button
					type="button"
					disabled={!completedCrop?.width || !completedCrop?.height}
					onClick={() =>
						generateDownload(
							previewCanvasRef.current,
							completedCrop
						)
					}
				>
					Download cropped image
				</button> */}
				<EditForm
					updateSignUp={updateSignUp}
					options={options}
					setOptions={setOptions}
					completedCrop={completedCrop}
				/>
			</div>
		</Spin>
	);
};

export default SignUpOptions;

// function UploadImage(props) {
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
// 			<h1>Imagen (Click para cambiar)</h1>
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
	const { updateSignUp, options, setOptions, completedCrop } = props;

	const onChange = (e) => {
		setOptions({
			...options,
			description: e.target.value,
		});
	};

	return (
		<Form className="form-edit" onFinish={updateSignUp}>
			{/* <Row justify="space-around">
				<Col span={8}>
					<h1>
						Título <span className="obligatory">*</span>
					</h1>
				</Col>
				<Col span={8}>
					<Form>
						<Form.Item>
							<Input
								value={options.title}
								allowClear
								placeholder="Título"
								onChange={(e) =>
									setOptions({
										...options,
										title: e.target.value,
									})
								}
								name="title"
							/>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			{options.title.length > 0 ? (
				<Row justify="space-around" className="colors">
					<Col span={8}>
						<h1 style={{ color: options.titlesColors }}>
							Color título
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
			<Row justify="space-around">
				<Col span={8}>
					<h1>
						Descripción <span className="obligatory">*</span>
					</h1>
				</Col>
				<Col span={8}>
					<Form>
						<Form.Item>
							<TextArea
								value={options.description}
								showCount
								allowClear
								onChange={onChange}
							/>
						</Form.Item>
					</Form>
				</Col>
			</Row> */}
			<Editor
				value={options.title ? options.title : ""}
				init={{
					height: 400,
					menubar: true,
					plugins: [
						"advlist autolink lists link image charmap print preview anchor",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table paste code help wordcount",
					],
					toolbar:
						"undo redo | formatselect | " +
						"bold italic backcolor | alignleft aligncenter " +
						"alignright alignjustify | bullist numlist outdent indent | " +
						"removeformat | help",
					content_style:
						"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
				}}
				onEditorChange={(content) =>
					setOptions({
						...options,
						title: content,
					})
				}
			/>
			{options.description.length > 0 ? (
				<Row justify="space-around" className="colors">
					<Col span={8}>
						<h1 style={{ color: options.textsColors }}>
							Color Descripción
						</h1>
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
			) : null}
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
			<Form.Item>
				<Button
					disabled={!completedCrop?.width || !completedCrop?.height}
					type="primary"
					htmlType="submit"
					className="btn-submit"
				>
					Actualizar
				</Button>
			</Form.Item>
		</Form>
	);
}

// function generateDownload(canvas, crop) {
// 	if (!crop || !canvas) {
// 		return;
// 	}

// 	canvas.toBlob(
// 		(blob) => {
// 			const previewUrl = window.URL.createObjectURL(blob);

// 			const anchor = document.createElement("a");
// 			anchor.download = "cropPreview.png";
// 			anchor.href = URL.createObjectURL(blob);
// 			anchor.click();
// 			window.URL.revokeObjectURL(previewUrl);
// 		},
// 		"image/png",
// 		1
// 	);
// }

function generateFile(canvas, setImage, name, fileExt) {
	if (!canvas) {
		return;
	}

	canvas.toBlob(
		(blob) => {
			console.log(fileExt);
			const file = new File([blob], `registro.${fileExt}`);
			setImage({ file, preview: URL.createObjectURL(file) });
		},
		`image/${fileExt}`,
		1
	);
}
