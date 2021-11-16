/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Spin, notification, Divider } from "antd";
import AddIcon from "@material-ui/icons/Add";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { putUploadBackgroundApi } from "../../../../../../api/Admin/singIn";

import "./Drawer.scss";

const DrawerBack = (props) => {
	const {
		token,
		save,
		setSave,
		options,
		setOptions,
		optionsId,
		status,
		reload,
		setReload,
		setVisible,
        previewCanvasRef1,
        fileExt,
        setFileExt,
        upImg,
        setUpImg,
	} = props;

	const [loading, setLoading] = useState(false);
    const [background, setBackground] = useState(null);

	// Crop
	const [labelInput, setLabelInput] = useState("Adjuntar Fondo");
	const imgRef = useRef(null);
	const [crop, setCrop] = useState({
		unit: "px",
		width: 1280,
		height: 800,
	});
	const [completedCrop, setCompletedCrop] = useState(null);

	useEffect(() => {
		if (background) {
			setOptions({
				...options,
				background: background.file,
			});
		}
	}, [background]);

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef1.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current;
		const canvas = previewCanvasRef1.current;
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
		generateFile(previewCanvasRef1.current, setBackground, "background", fileExt);
	}, [completedCrop]);

    useEffect(() => {
		if (save) {
			updateSignInBack();
			setSave(false);
		}
	}, [save]);

	const updateSignInBack = async () => {
		let optionsUpdate = options;
		setLoading(true);
		if (typeof optionsUpdate.background == "object") {
			if (status) {
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
                    setReload(!reload);
                    setVisible(false);
                    setLoading(false);
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
				}
			} else {
                notification["error"]({
                    message: "Debes editar el componente primero",
                });
				setLoading(false);
			}
		} else {
            notification["error"]({
                message: "Error al actualizar el fondo",
            });
			setLoading(false);
		}
	};

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setLabelInput(e.target.files[0].name);
			const extSplit = e.target.files[0].name.split(".");
			setFileExt(extSplit[1]);
			const reader = new FileReader();
			reader.addEventListener("load", () => {
                setUpImg(reader.result)
                console.log(reader.result)
            });
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="signin-drawer">
                <Divider orientation="left">Fondo (1280px X 800px)</Divider>
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
						style={{ width: "1280px", minWidth: "1280px" }}
						onChange={(c) => setCrop(c)}
						onComplete={(c) => setCompletedCrop(c)}
					/>
                    <canvas
                        ref={previewCanvasRef1}
                        crossorigin="anonymous"
                        className="hide"
                    />
				</div>
			</div>
		</Spin>
	);
};

export default DrawerBack;

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
