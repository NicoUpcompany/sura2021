/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, Spin, Row, Col, notification, Divider } from "antd";
import { BlockPicker } from "react-color";

import {
	getColorsApi,
	postColorsApi,
	putColorsApi,
} from "../../../../api/Admin/color";

import "./Colors.scss";

const Colors = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [buttonBackground, setButtonBackground] = useState("default");
	const [buttonBackgroundHover, setButtonBackgroundHover] = useState(
		"default"
	);
	const [titlesColors, setTitlesColors] = useState("default");
	const [textsColors, setTextsColors] = useState("default");
	const [state, setState] = useState(false);
	const [state2, setState2] = useState(false);
	const [state3, setState3] = useState(false);
	const [state4, setState4] = useState(false);
	const [colorsState, setColorsState] = useState(false);
	const [colorsId, setColorsId] = useState("");

	useEffect(() => {
		setLoading(true);
		getColors();
	}, []);

	const getColors = async () => {
		const resp = await getColorsApi();
		if (resp.ok) {
			setButtonBackground(resp.colors.button);
			setButtonBackgroundHover(resp.colors.buttonHover);
			setTitlesColors(resp.colors.titlesColors);
			setTextsColors(resp.colors.textsColors);
			setColorsId(resp.colors._id);
			setColorsState(true);
			setLoading(false);
		} else {
			setColorsState(false);
			setLoading(false);
		}
	};

	const saveOrUpdateColors = async () => {
		setLoading(true);
		if (colorsState) {
			const data = {
				button: buttonBackground,
				buttonHover: buttonBackgroundHover,
				titlesColors: titlesColors,
				textsColors: textsColors,
			};
			const resp = await putColorsApi(token, data, colorsId);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				getColors();
			} else {
				notification["error"]({
					message: resp.message,
				});
			}
		} else {
			const data = {
				button: buttonBackground,
				buttonHover: buttonBackgroundHover,
				titlesColors: titlesColors,
				textsColors: textsColors,
			};
			const resp = await postColorsApi(token, data);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				getColors();
			} else {
				notification["error"]({
					message: resp.message,
				});
			}
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="general">
				<Row justify="space-around">
					<Col span={8}>
						<div className="button">
							<Button
								type="primary"
								id="button1"
								style={{ backgroundColor: buttonBackground }}
								onClick={() => setState(!state)}
							>
								{state ? (
									<span>Ocultar</span>
								) : (
									<span>Color Botones</span>
								)}
							</Button>
						</div>
						{state ? (
							<div className="block-picker">
								<BlockPicker
									color={buttonBackground}
									onChangeComplete={(color) =>
										setButtonBackground(color.hex)
									}
								/>
							</div>
						) : null}
					</Col>
					<Col span={8}>
						<div className="button">
							<Button
								type="primary"
								id="button2"
								style={{
									backgroundColor: buttonBackgroundHover,
								}}
								onClick={() => setState2(!state2)}
							>
								{state2 ? (
									<span>Ocultar</span>
								) : (
									<span>Color Hover Botones</span>
								)}
							</Button>
						</div>
						{state2 ? (
							<div className="block-picker">
								<BlockPicker
									color={buttonBackgroundHover}
									onChangeComplete={(color) =>
										setButtonBackgroundHover(color.hex)
									}
								/>
							</div>
						) : null}
					</Col>
				</Row>
				<Divider />
				<Row justify="space-around">
					<Col span={8}>
						<div className="button">
							<h1
								style={{
									textAlign: "center",
									color: titlesColors,
								}}
							>
								Título
							</h1>
							<Button
								type="primary"
								id="button1"
								onClick={() => setState3(!state3)}
							>
								{state3 ? (
									<span>Ocultar</span>
								) : (
									<span>Color Títulos</span>
								)}
							</Button>
						</div>
						{state3 ? (
							<div className="block-picker">
								<BlockPicker
									color={titlesColors}
									onChangeComplete={(color) =>
										setTitlesColors(color.hex)
									}
								/>
							</div>
						) : null}
					</Col>
					<Col span={8}>
						<p style={{ textAlign: "center", color: textsColors }}>
							Texto
						</p>
						<div className="button">
							<Button
								type="primary"
								id="button2"
								onClick={() => setState4(!state4)}
							>
								{state4 ? (
									<span>Ocultar</span>
								) : (
									<span>Color textos</span>
								)}
							</Button>
						</div>
						{state4 ? (
							<div className="block-picker">
								<BlockPicker
									color={textsColors}
									onChangeComplete={(color) =>
										setTextsColors(color.hex)
									}
								/>
							</div>
						) : null}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Button
							type="primary"
							className="button"
							shape="round"
							htmlType="submit"
							onClick={() => saveOrUpdateColors()}
						>
							Actualizar
						</Button>
					</Col>
				</Row>
			</div>
		</Spin>
	);
};

export default Colors;
