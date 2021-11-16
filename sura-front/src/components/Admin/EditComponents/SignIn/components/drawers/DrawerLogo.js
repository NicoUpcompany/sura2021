/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Spin, notification, Divider } from "antd";
import AddIcon from "@material-ui/icons/Add";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { putUploadLogoApi } from "../../../../../../api/Admin/singIn";

import "./Drawer.scss";

const DrawerLogo = (props) => {
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
    const [logo, setLogo] = useState("");

	// Crop
	const [labelInput, setLabelInput] = useState("Adjuntar logo");
	const imgRef = useRef(null);
	const [crop, setCrop] = useState({
		unit: "px",
		width: 420,
		height: 120,
	});
	const [completedCrop, setCompletedCrop] = useState(null);

	useEffect(() => {
		if (logo) {
			setOptions({
				...options,
				logo: logo.file,
			});
		}
	}, [logo]);

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
		generateFile(previewCanvasRef1.current, setLogo, "logo", fileExt);
	}, [completedCrop]);

    useEffect(() => {
		if (save) {
			updateSignInLogo();
			setSave(false);
		}
	}, [save]);

	const updateSignInLogo = async () => {
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
                message: "Error al actualizar logo",
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
			reader.addEventListener("load", () => setUpImg(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="signin-drawer">
                <Divider orientation="left">Logo (420px X 120px)</Divider>
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
						style={{ width: "420px", minWidth: "420px" }}
						onChange={(c) => setCrop(c)}
						onComplete={(c) => setCompletedCrop(c)}
					/>
					<canvas
						ref={previewCanvasRef1}
						crossorigin="anonymous"
						className="titulo hide"
					/>
				</div>
			</div>
		</Spin>
	);
};

export default DrawerLogo;

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
