/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import Editor from "./Editor";
// import useLocalStorage from "../../../hooks/useLocalStorage";

const App = (props) => {
	
	const [srcDoc, setSrcDoc] = useState("");
	const { inputs, setInputs } = props;


	useEffect(() => {
		const timeout = setTimeout(() => {
			setSrcDoc(`
                <html>
                <body>${inputs.html}</body>
                </html>
            `);
		}, 250);
		return () => clearTimeout(timeout);
	}, [inputs.html]);

	return (
		<div className="mailing-editor">
			<div className="pane top-pane">
				<Editor
					language="xml"
					displayName="HTML"
					inputs={inputs}
					setInputs={setInputs}
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
				/>
			</div>
		</div>
	);
};

export default App;
