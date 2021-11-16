/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

export default function LoginForm() {
	const [inputs, setInputs] = useState({
		email: "",
	});

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<form
			onChange={changeForm}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<div className="campo">
				<TextField
					label="Correo"
					type="email"
					variant="filled"
					id="email"
					name="email"
					value={inputs.email}
				/>
			</div>
			<div className="campobutton">
				<button
					className="btn"
					style={{ border: "transparent", cursor: "pointer" }}
				>
					Ingresar
				</button>
			</div>
			<a className="enlace">Aún no estoy registrado</a>
		</form>
	);
}
