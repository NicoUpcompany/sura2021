import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { getAccessTokenApi } from "../api/auth";
import Socket from "../utils/socket";
import { getColorsApi } from "../api/Admin/color";
import { getConfirmApi, getConfirmImageApi } from "../api/Admin/confirm";

import "./Error404.scss";

export default function Error404() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getData();
		const token = getAccessTokenApi();
		if (token !== null) {
			const decodedToken = jwtDecode(token);
			if (decodedToken) {
				const user = {
					id: decodedToken.id,
					route: window.location.pathname,
				};
				Socket.emit("UPDATE_ROUTE", user);
			}
		}
	}, []);

	const getData = async () => {
		setLoading(true);
		const result = await getConfirmApi();
		if (result.ok) {
			if (result.confirm.background.length > 0) {
				const backgroundResult = await getConfirmImageApi(
					result.confirm.background
				);
				const colors = await getColorsApi();
				if (colors.ok) {
					var css = `
                        .error #oopss {
                            background-image: url(${backgroundResult}) !important;
                        }
                        .error #error-text p {
                            color: ${colors.colors.textsColors} !important;
                        }
                        .error #error-text span,
                        .error .hmpg .back {
                            background-color: ${colors.colors.button} !important;
                        }
                        .error #error-text span:hover,
                        .error .hmpg .back:hover {
                            background-color: ${colors.colors.buttonHover} !important;
                        }`;
					var style = document.createElement("style");

					if (style.styleSheet) {
						style.styleSheet.cssText = css;
					} else {
						style.appendChild(document.createTextNode(css));
					}
					document.getElementsByTagName("head")[0].appendChild(style);
					setLoading(false);
				}
			}
		}
	};

    const antIcon = <LoadingOutlined spin />;

	return (
        <Spin
			spinning={loading}
			size="large"
			tip="Cargando..."
			indicator={antIcon}
		>
            <div className="error">
                <div id="oopss">
                    <div id="error-text">
                        <span>404</span>
                        <p>PÁGINA NO ENCONTRADA</p>
                        <p className="hmpg">
                            <Link to="/" className="back">
                                Volver al inicio
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Spin>
	);
}
