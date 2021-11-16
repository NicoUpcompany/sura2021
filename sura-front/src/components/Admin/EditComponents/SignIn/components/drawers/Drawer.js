/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Spin, Row, Col, notification, Form, Divider, Tooltip } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { PhotoshopPicker } from "react-color";
import { Editor } from "@tinymce/tinymce-react";

import {
	postSignInApi,
	putSignInApi,
} from "../../../../../../api/Admin/singIn";

import "./Drawer.scss";

const DrawerOptions = (props) => {
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
	} = props;

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (save) {
			updateSignIn();
			setSave(false);
		}
	}, [save]);

	const updateSignIn = async () => {
		let optionsUpdate = options;
		setLoading(true);
		if (status) {
			const resp = await putSignInApi(token, optionsUpdate, optionsId);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
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
			const resp = await postSignInApi(token, options);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
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
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="signin-drawer">
				<Form className="form-edit">
					<Divider orientation="left">Título</Divider>
					<Row justify="space-around">
						<Col span={16}>
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
						</Col>
					</Row>
					<Divider orientation="left">Descripción</Divider>
					<Row justify="space-around">
						<Col span={16}>
							<Editor
								value={options.text ? options.text : ""}
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
										text: content,
									})
								}
							/>
						</Col>
					</Row>
					<Divider orientation="left">Color Botón</Divider>
					<Row justify="space-around">
						<Col span={16}>
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
					<Divider orientation="left">
						Color Hover Botón{" "}
						<Tooltip title="Color que se muestra al pasar el mouse por encima o al hacer click">
							<QuestionCircleTwoTone />
						</Tooltip>
					</Divider>
					<Row justify="space-around">
						<Col span={16}>
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
					<Divider orientation="left">Color Texto Cronómetro</Divider>
					<Row justify="space-around">
						<Col span={16}>
							<PhotoshopPicker
								color={options.chronometerColors}
								onChangeComplete={(color) =>
									setOptions({
										...options,
										chronometerColors: color.hex,
									})
								}
							/>
						</Col>
					</Row>
				</Form>
			</div>
		</Spin>
	);
};

export default DrawerOptions;
