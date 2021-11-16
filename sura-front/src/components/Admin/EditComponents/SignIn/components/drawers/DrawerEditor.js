/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { notification, Spin } from "antd";

import { putSignInApi } from "../../../../../../api/Admin/singIn";
import Editor from "../Editor";

function DrawerEditor(props) {
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
        html,
        setHtml,
        css,
        setCss,
        js,
        setJs,
	} = props;

	const [loading, setLoading] = useState(false);

	const srcDoc = `
        <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>${js}</script>
        </html>
    `;

	useEffect(() => {
		if (save) {
			updateSignInCode();
			setSave(false);
		}
	}, [save]);

	useEffect(() => {
		setOptions({
			...options,
			statusCode: true,
			htmlCode: html,
		});
	}, [html]);

	useEffect(() => {
		setOptions({
			...options,
			statusCode: true,
			cssCode: css,
		});
	}, [css]);

	useEffect(() => {
		setOptions({
			...options,
			statusCode: true,
			jsCode: js,
		});
	}, [js]);

	const updateSignInCode = async () => {
		let optionsUpdate = options;
		setLoading(true);
		if (status) {
			const resp = await putSignInApi(
				token,
				optionsUpdate,
				optionsId
			);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				setReload(!reload);
				setLoading(false);
				setVisible(false);
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
			}
		} else {
			notification["error"]({
				message: "Error al agregar código extra",
			});
			setLoading(false);
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="drawer-editor-signin">
				<div className="pane top-pane">
					<Editor
						language="xml"
						displayName="HTML"
						value={html}
						onChange={setHtml}
					/>
					<Editor
						language="css"
						displayName="CSS"
						value={css}
						onChange={setCss}
					/>
					<Editor
						language="javascript"
						displayName="JS"
						value={js}
						onChange={setJs}
					/>
				</div>
				<div className="pane">
					<iframe
						srcDoc={srcDoc}
						title="output"
						sandbox="allow-scripts"
						frameBorder="0"
						width="100%"
						height="100%"
						style={{ border: "1px dashed #ccc" }}
					/>
				</div>
			</div>
		</Spin>
	);
}

export default DrawerEditor;
