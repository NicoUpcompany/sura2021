/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
	notification,
	Spin,
	Table,
	Input,
	Space,
	Button,
	ConfigProvider,
	Drawer,
	Select,
	Form,
} from "antd";
import es_ES from "antd/es/locale/es_ES";
import {
	SearchOutlined,
	ExportOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import jwtDecode from "jwt-decode";
import XLSX from "xlsx";
import { ExportSheet } from "react-xlsx-sheet";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import Socket from "../../../utils/socket";
import {
	getUsersApi,
	changeRoleApi,
	deleteUserApi,
	signUpApi,
} from "../../../api/user";
import { getAccessTokenApi } from "../../../api/auth";
import { getAccreditationApi } from "../../../api/Admin/accreditation";
import {
	emailValidation,
	minLengthValidation,
	rutValidation,
} from "../../../utils/formValidation";

import "./Users.scss";

const { Option } = Select;

const userHeaders = [
	{ title: "ID", dataIndex: "_id" },
	{ title: "Nombre", dataIndex: "nameAux" },
	{ title: "Correo", dataIndex: "email" },
	{ title: "Rut", dataIndex: "rut" },
	{ title: "Empresa", dataIndex: "enterprise" },
	{ title: "Cargo", dataIndex: "position" },
	{ title: "Teléfono", dataIndex: "phone" },
	{ title: "País", dataIndex: "country" },
	{ title: "Dirección", dataIndex: "adress" },
	{ title: "Otro", dataIndex: "other" },
	{ title: "Rol", dataIndex: "role" },
	{ title: "Día y hora de registro", dataIndex: "signUpTime" },
	{ title: "Último inicio de sesión", dataIndex: "signInTime" },
	{ title: "Última conexión sala de espera", dataIndex: "waitingRoomTime" },
	{ title: "Última conexión stream", dataIndex: "streamTime" },
];

let searchInput = "";

export default function Users() {
	const history = useHistory();

	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [usersData, setUsersData] = useState([]);

	// Add user
	const [visible, setVisible] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const [stateForm, setStateForm] = useState(false);
	const [even, setEven] = useState(false);
	const [lastOdd, setLastOdd] = useState("");
	const [inputs, setInputs] = useState({
		email: "",
		fullName: "",
		name: "",
		lastname: "",
		rut: "",
		enterprise: "",
		position: "",
		phone: "",
		country: "",
		adress: "",
		otherText: "",
	});
	const [formValid, setFormValid] = useState({
		email: false,
		fullName: false,
		name: false,
		lastname: false,
		rut: false,
		enterprise: false,
		position: false,
		phone: false,
		country: false,
		adress: false,
		otherText: false,
	});
	const [data, setData] = useState({
		email: true,
		fullName: false,
		name: false,
		lastname: false,
		rut: false,
		enterprise: false,
		position: false,
		phone: false,
		country: false,
		adress: false,
		other: false,
		otherText: "",
	});

	useEffect(() => {
		try {
			setLoading(true);
			setLoading2(true);
			let interval;
			const token = getAccessTokenApi();
			if (token === null) {
				history.push("/dashboard/iniciarsesion");
			} else {
				const decodedToken = jwtDecode(token);
				if (decodedToken.role !== "Admin") {
					history.push("/dashboard/iniciarsesion");
				} else {
					const user = {
						id: decodedToken.id,
						route: window.location.pathname,
					};
					Socket.emit("UPDATE_ROUTE", user);
					getData(token);
					interval = setInterval(() => {
						getUsers(token);
					}, 5000);
				}
			}
			return () => clearInterval(interval);
		} catch (error) {
			history.push("/dashboard/iniciarsesion");
		}
	}, []);

	const getUsers = async (token) => {
		await getUsersApi(token).then((resp) => {
			const arrayUsers = [];
			if (!resp.ok) {
				notification["error"]({
					message: resp.message,
				});
			} else {
				resp.users.forEach((item) => {
					let name;
					if (item.name.length > 0) {
						name = item.name;
					}
					if (item.lastname.length > 0) {
						name = name + " " + item.lastname;
					}
					if (item.fullName.length > 0) {
						name = item.fullName;
					}
					const element = {
						...item,
						nameAux: name,
						key: item._id,
					};
					arrayUsers.push(element);
				});
			}
			setUsersData(arrayUsers);
			setLoading(false);
		});
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						searchInput = node;
					}}
					placeholder={"Buscar"}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ width: 188, marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Buscar
					</Button>
					<Button
						onClick={() => handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Limpiar
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{ color: filtered ? "#1890ff" : undefined }}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: "",
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	const changeRole = async (user) => {
		setLoading(true);
		const token = getAccessTokenApi();
		await changeRoleApi(user._id, token).then((resp) => {
			if (!resp.ok) {
				notification["error"]({
					message: resp.message,
				});
			} else {
				notification["success"]({
					message: resp.message,
				});
			}
			getUsers(token);
		});
	};

	const deleteUser = async (user) => {
		setLoading(true);
		const token = getAccessTokenApi();
		await deleteUserApi(user._id, token).then((resp) => {
			if (!resp.ok) {
				notification["error"]({
					message: resp.message,
				});
			} else {
				notification["success"]({
					message: resp.message,
				});
			}
			getUsers(token);
		});
	};

	const columns = [
		{
			title: "Correo",
			dataIndex: "email",
			key: "email",
			fixed: "left",
			width: 150,
			...getColumnSearchProps("email"),
		},
		{
			title: "ID",
			dataIndex: "_id",
			key: "_id",
			width: 150,
			...getColumnSearchProps("_id"),
		},
		{
			title: "Nombre",
			dataIndex: "nameAux",
			key: "nameAux",
			width: 150,
			...getColumnSearchProps("nameAux"),
		},
		{
			title: "Rut",
			dataIndex: "rut",
			key: "rut",
			width: 150,
			...getColumnSearchProps("rut"),
		},
		{
			title: "Empresa",
			dataIndex: "enterprise",
			key: "enterprise",
			width: 150,
			...getColumnSearchProps("enterprise"),
		},
		{
			title: "Cargo",
			dataIndex: "position",
			key: "position",
			width: 150,
			...getColumnSearchProps("position"),
		},
		{
			title: "Teléfono",
			dataIndex: "phone",
			key: "phone",
			width: 150,
			...getColumnSearchProps("phone"),
		},
		{
			title: "País",
			dataIndex: "country",
			key: "country",
			width: 150,
			...getColumnSearchProps("country"),
		},
		{
			title: "Dirección",
			dataIndex: "adress",
			key: "adress",
			width: 150,
			...getColumnSearchProps("adress"),
		},
		{
			title: "Campo otros",
			dataIndex: "other",
			key: "other",
			width: 150,
			...getColumnSearchProps("other"),
		},
		{
			title: "Rol",
			dataIndex: "role",
			key: "role",
			width: 150,
			filters: [
				{
					text: "Administrador",
					value: "Admin",
				},
				{
					text: "Usuario",
					value: "User",
				},
			],
			onFilter: (value, record) => record.role.indexOf(value) === 0,
		},
		{
			title: "Día y hora de registro",
			dataIndex: "signUpTime",
			key: "signUpTime",
			width: 150,
			sorter: (a, b) => a.signUpTime.length - b.signUpTime.length,
		},
		{
			title: "Último inicio de sesión",
			dataIndex: "signInTime",
			key: "signInTime",
			width: 150,
			sorter: (a, b) => a.signInTime.length - b.signInTime.length,
		},
		{
			title: "Última conexión sala de espera",
			dataIndex: "waitingRoomTime",
			key: "waitingRoomTime",
			width: 150,
			sorter: (a, b) =>
				a.waitingRoomTime.length - b.waitingRoomTime.length,
		},
		{
			title: "Última conexión stream",
			dataIndex: "streamTime",
			key: "streamTime",
			width: 150,
			sorter: (a, b) => a.streamTime.length - b.streamTime.length,
		},
		{
			title: "Opción",
			key: "operation",
			fixed: "right",
			width: 200,
			render: (text, record) => (
				<>
					{record.role === "User" ? (
						<>
							<a onClick={() => changeRole(record)}>
								Cambiar Rol
							</a>{" "}
							/ <a onClick={() => deleteUser(record)}>Eliminar</a>
						</>
					) : (
						<>
							<a onClick={() => changeRole(record)}>
								Cambiar Rol
							</a>
						</>
					)}
				</>
			),
		},
	];

	const getData = async () => {
		const resp = await getAccreditationApi();
		if (!resp.ok) {
			setStateForm(false);
			setLoading2(false);
		} else {
			const accreditation = resp.acreditacion;
			setData({
				email: accreditation.email,
				fullName: accreditation.fullName,
				name: accreditation.name,
				lastname: accreditation.lastname,
				rut: accreditation.rut,
				enterprise: accreditation.enterprise,
				position: accreditation.position,
				phone: accreditation.phone,
				country: accreditation.country,
				adress: accreditation.adress,
				other: accreditation.other,
				otherText: accreditation.otherText,
			});
			let countAux = 0;
			if (accreditation.email) {
				countAux = countAux + 1;
				setLastOdd("email");
			}
			if (accreditation.fullName) {
				countAux = countAux + 1;
				setLastOdd("fullName");
			}
			if (accreditation.name) {
				countAux = countAux + 1;
				setLastOdd("name");
			}
			if (accreditation.lastname) {
				countAux = countAux + 1;
				setLastOdd("lastname");
			}
			if (accreditation.rut) {
				countAux = countAux + 1;
				setLastOdd("rut");
			}
			if (accreditation.enterprise) {
				countAux = countAux + 1;
				setLastOdd("enterprise");
			}
			if (accreditation.position) {
				countAux = countAux + 1;
				setLastOdd("position");
			}
			if (accreditation.phone) {
				countAux = countAux + 1;
				setLastOdd("phone");
			}
			if (accreditation.country) {
				countAux = countAux + 1;
				setLastOdd("country");
			}
			if (accreditation.adress) {
				countAux = countAux + 1;
				setLastOdd("adress");
			}
			if (accreditation.other) {
				countAux = countAux + 1;
				setLastOdd("other");
			}
			if (countAux % 2 === 0) {
				setEven(true);
			} else {
				setEven(false);
			}
			setStateForm(true);
			setLoading2(false);
		}
	};

	const createUser = async () => {
		setLoading2(true);
		let statusFunction = true;
		let valFullName;
		let fullNameValid;
		let valName;
		let nameValid;
		let valLastName;
		let lastNameValid;
		let valRut;
		let rutValid;
		let valEnterprise;
		let enterpriseValid;
		let valPosition;
		let positionValid;
		let valPhone;
		let phoneValid;
		let valCountry;
		let countryValid;
		let valAdress;
		let adressValid;
		let valOtherText;
		let otherTextValid;
		if (data.fullName) {
			valFullName = inputs.fullName;
			fullNameValid = formValid.fullName;
			if (!fullNameValid) {
				notification["error"]({
					message: "Ingrese un nombre completo válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valFullName) {
				notification["error"]({
					message: "Nombre completo es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.name) {
			valName = inputs.name;
			nameValid = formValid.name;
			if (!nameValid) {
				notification["error"]({
					message: "Ingrese un nombre válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valName) {
				notification["error"]({
					message: "Nombre es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.lastname) {
			valLastName = inputs.lastname;
			lastNameValid = formValid.lastname;
			if (!lastNameValid) {
				notification["error"]({
					message: "Ingrese un apellido válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valLastName) {
				notification["error"]({
					message: "Apellido es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.rut) {
			valRut = inputs.rut;
			rutValid = formValid.rut;
			if (!rutValid) {
				notification["error"]({
					message: "Ingrese un rut válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valRut) {
				notification["error"]({
					message: "Rut es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.enterprise) {
			valEnterprise = inputs.enterprise;
			enterpriseValid = formValid.enterprise;
			if (!enterpriseValid) {
				notification["error"]({
					message: "Ingrese una empresa válida",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valEnterprise) {
				notification["error"]({
					message: "Empresa es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.position) {
			valPosition = inputs.position;
			positionValid = formValid.position;
			if (!positionValid) {
				notification["error"]({
					message: "Ingrese un cargo válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valPosition) {
				notification["error"]({
					message: "Cargo es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.phone) {
			valPhone = inputs.phone;
			phoneValid = formValid.phone;
			if (!phoneValid) {
				notification["error"]({
					message: "Ingrese un teléfono válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valPhone) {
				notification["error"]({
					message: "Teléfono es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.country) {
			valCountry = inputs.country;
			countryValid = true;
			if (!countryValid) {
				notification["error"]({
					message: "Ingrese un país válido",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valCountry) {
				notification["error"]({
					message: "País es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.adress) {
			valAdress = inputs.adress;
			adressValid = formValid.adress;
			if (!adressValid) {
				notification["error"]({
					message: "Ingrese una dirección válida",
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valAdress) {
				notification["error"]({
					message: "Dirección es un campo obligatorio",
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		if (data.other) {
			valOtherText = inputs.otherText;
			otherTextValid = formValid.otherText;
			if (!otherTextValid) {
				notification["error"]({
					message: `El campo ${data.otherText} no es válido`,
				});
				setLoading2(false);
				statusFunction = false;
			}
			if (!valOtherText) {
				notification["error"]({
					message: `${data.otherText} es un campo obligatorio`,
				});
				setLoading2(false);
				statusFunction = false;
			}
		}
		const valEmail = inputs.email;
		const emailValid = formValid.email;
		if (!emailValid) {
			notification["error"]({
				message: "Ingrese un correo válido",
			});
			setLoading2(false);
			statusFunction = false;
		}
		if (!valEmail) {
			notification["error"]({
				message: "Correo es un campo obligatorio",
			});
			setLoading2(false);
			statusFunction = false;
		}
		if (statusFunction) {
			const result = await signUpApi(inputs);
			if (!result.ok) {
				notification["error"]({
					message: result.message,
				});
				setLoading2(false);
				setVisible(false);
			} else {
				setInputs({
					email: "",
					fullName: "",
					name: "",
					lastname: "",
					rut: "",
					enterprise: "",
					position: "",
					phone: "",
					country: "",
					adress: "",
					otherText: "",
				});
				setFormValid({
					email: false,
					fullName: false,
					name: false,
					lastname: false,
					rut: false,
					enterprise: false,
					position: false,
					phone: false,
					country: false,
					adress: false,
					otherText: false,
				});
				setVisible(false);
				setLoading2(false);
			}
		}
	};

	const changeForm = (e) => {
		setInputs({
			...inputs,
			[e.target.name]: e.target.value,
		});
	};

	const inputValidation = async (e) => {
		const { type, name } = e.target;

		if (type === "email") {
			setFormValid({
				...formValid,
				[name]: emailValidation(e.target),
			});
		}
		if (type === "text") {
			if (name === "rut") {
				setFormValid({
					...formValid,
					[name]: rutValidation(e.target),
				});
			} else {
				setFormValid({
					...formValid,
					[name]: minLengthValidation(e.target, 2),
				});
			}
		}
	};

	function onChangeCountry(value) {
		setInputs({
			...inputs,
			country: value,
		});
	}

	return (
		<ConfigProvider locale={es_ES}>
			<Spin spinning={loading} size="large" tip="Cargando...">
				<Button
					type="primary"
					style={{ position: "absolute", right: 0 }}
					onClick={() => setVisible(true)}
				>
					<PlusOutlined /> Nuevo Usuario
				</Button>
				<div className="users">
					<h1 className="title">Listado de usuarios</h1>
					<Table
						columns={columns}
						dataSource={usersData}
						bordered
						pagination={true}
						scroll={{ x: 1500, y: 300 }}
						sticky
					/>
					<ExportSheet
						header={userHeaders}
						fileName={`lista_usuarios`}
						dataSource={usersData}
						xlsx={XLSX}
					>
						<Button
							className="_btn"
							icon={<ExportOutlined />}
							type="danger"
						>
							Exportar participantes
						</Button>
					</ExportSheet>
				</div>
			</Spin>
			<Drawer
				title="Crear nuevo usuario"
				width={720}
				onClose={() => setVisible(false)}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: "right",
						}}
					>
						<Button
							onClick={() => setVisible(false)}
							style={{ marginRight: 8 }}
						>
							Cancelar
						</Button>
						<Button onClick={createUser} type="primary">
							Crear
						</Button>
					</div>
				}
			>
				<Spin spinning={loading2} size="large" tip="Cargando...">
					<div className="users">
						{stateForm ? (
							<Form onChange={changeForm}>
								{data.email ? (
									<div
										className={`${
											!even && lastOdd === "email"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="email"
											type="email"
											name="email"
											label="Correo"
											variant="filled"
											value={inputs.email}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.fullName ? (
									<div
										className={`${
											!even && lastOdd === "fullName"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="name"
											type="text"
											name="fullName"
											label="Nombre Completo"
											variant="filled"
											value={inputs.fullName}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.name ? (
									<div
										className={`${
											!even && lastOdd === "name"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="name"
											type="text"
											name="name"
											label="Nombre"
											variant="filled"
											value={inputs.name}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.lastname ? (
									<div
										className={`${
											!even && lastOdd === "lastname"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="lastname"
											type="text"
											name="lastname"
											label="Apellido"
											variant="filled"
											value={inputs.lastname}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.rut ? (
									<div
										className={`${
											!even && lastOdd === "rut"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="rut"
											type="text"
											name="rut"
											label="Rut"
											variant="filled"
											value={inputs.rut}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.enterprise ? (
									<div
										className={`${
											!even && lastOdd === "enterprise"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="enterprise"
											type="text"
											name="enterprise"
											label="Empresa"
											variant="filled"
											value={inputs.enterprise}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.position ? (
									<div
										className={`${
											!even && lastOdd === "position"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="position"
											type="text"
											name="position"
											label="Cargo"
											variant="filled"
											value={inputs.position}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.phone ? (
									<div
										className={`${
											!even && lastOdd === "phone"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="phone"
											type="text"
											name="phone"
											label="Teléfono"
											variant="filled"
											value={inputs.phone}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.country ? (
									<div
										className={`${
											!even && lastOdd === "country"
												? "odd"
												: "mitad"
										}`}
									>
										<Select
											showSearch
											style={{
												width: "100%",
											}}
											placeholder="País"
											optionFilterProp="children"
											onChange={onChangeCountry}
											filterOption={(input, option) =>
												option.children
													.toLowerCase()
													.indexOf(
														input.toLowerCase()
													) >= 0
											}
										>
											<Option value="Afganistán">
												Afganistán
											</Option>
											<Option value="Albania">
												Albania
											</Option>
											<Option value="Alemania">
												Alemania
											</Option>
											<Option value="Andorra">
												Andorra
											</Option>
											<Option value="Angola">
												Angola
											</Option>
											<Option value="Antigua y Barbuda">
												Antigua y Barbuda
											</Option>
											<Option value="Arabia Saudita">
												Arabia Saudita
											</Option>
											<Option value="Argelia">
												Argelia
											</Option>
											<Option value="Argentina">
												Argentina
											</Option>
											<Option value="Armenia">
												Armenia
											</Option>
											<Option value="Australia">
												Australia
											</Option>
											<Option value="Austria">
												Austria
											</Option>
											<Option value="Azerbaiyán">
												Azerbaiyán
											</Option>
											<Option value="Bahamas">
												Bahamas
											</Option>
											<Option value="Bangladés">
												Bangladés
											</Option>
											<Option value="Barbados">
												Barbados
											</Option>
											<Option value="Baréin">
												Baréin
											</Option>
											<Option value="Bélgica">
												Bélgica
											</Option>
											<Option value="Belice">
												Belice
											</Option>
											<Option value="Benín">Benín</Option>
											<Option value="Bielorrusia">
												Bielorrusia
											</Option>
											<Option value="Birmania">
												Birmania
											</Option>
											<Option value="Bolivia">
												Bolivia
											</Option>
											<Option value="Bosnia y Herzegovina">
												Bosnia y Herzegovina
											</Option>
											<Option value="Botsuana">
												Botsuana
											</Option>
											<Option value="Brasil">
												Brasil
											</Option>
											<Option value="Brunéi">
												Brunéi
											</Option>
											<Option value="Bulgaria">
												Bulgaria
											</Option>
											<Option value="Burkina Faso">
												Burkina Faso
											</Option>
											<Option value="Burundi">
												Burundi
											</Option>
											<Option value="Bután">Bután</Option>
											<Option value="Cabo Verde">
												Cabo Verde
											</Option>
											<Option value="Camboya">
												Camboya
											</Option>
											<Option value="Camerún">
												Camerún
											</Option>
											<Option value="Canadá">
												Canadá
											</Option>
											<Option value="Catar">Catar</Option>
											<Option value="Chad">Chad</Option>
											<Option value="Chile">Chile</Option>
											<Option value="China">China</Option>
											<Option value="Chipre">
												Chipre
											</Option>
											<Option value="Ciudad del Vaticano">
												Ciudad del Vaticano
											</Option>
											<Option value="Colombia">
												Colombia
											</Option>
											<Option value="Comoras">
												Comoras
											</Option>
											<Option value="Corea del Norte">
												Corea del Norte
											</Option>
											<Option value="Corea del Sur">
												Corea del Sur
											</Option>
											<Option value="Costa de Marfil">
												Costa de Marfil
											</Option>
											<Option value="Costa Rica">
												Costa Rica
											</Option>
											<Option value="Croacia">
												Croacia
											</Option>
											<Option value="Cuba">Cuba</Option>
											<Option value="Dinamarca">
												Dinamarca
											</Option>
											<Option value="Dominica">
												Dominica
											</Option>
											<Option value="Ecuador">
												Ecuador
											</Option>
											<Option value="Egipto">
												Egipto
											</Option>
											<Option value="El Salvador">
												El Salvador
											</Option>
											<Option value="Emiratos Árabes Unidos">
												Emiratos Árabes Unidos
											</Option>
											<Option value="Eritrea">
												Eritrea
											</Option>
											<Option value="Eslovaquia">
												Eslovaquia
											</Option>
											<Option value="Eslovenia">
												Eslovenia
											</Option>
											<Option value="España">
												España
											</Option>
											<Option value="Estados Unidos">
												Estados Unidos
											</Option>
											<Option value="Estonia">
												Estonia
											</Option>
											<Option value="Etiopía">
												Etiopía
											</Option>
											<Option value="Filipinas">
												Filipinas
											</Option>
											<Option value="Finlandia">
												Finlandia
											</Option>
											<Option value="Fiyi">Fiyi</Option>
											<Option value="Francia">
												Francia
											</Option>
											<Option value="Gabón">Gabón</Option>
											<Option value="Gambia">
												Gambia
											</Option>
											<Option value="Georgia">
												Georgia
											</Option>
											<Option value="Ghana">Ghana</Option>
											<Option value="Granada">
												Granada
											</Option>
											<Option value="Grecia">
												Grecia
											</Option>
											<Option value="Guatemala">
												Guatemala
											</Option>
											<Option value="Guyana">
												Guyana
											</Option>
											<Option value="Guinea">
												Guinea
											</Option>
											<Option value="Guinea ecuatorial">
												Guinea ecuatorial
											</Option>
											<Option value="Guinea-Bisáu">
												Guinea-Bisáu
											</Option>
											<Option value="Haití">Haití</Option>
											<Option value="Honduras">
												Honduras
											</Option>
											<Option value="Hungría">
												Hungría
											</Option>
											<Option value="India">India</Option>
											<Option value="Indonesia">
												Indonesia
											</Option>
											<Option value="Irak">Irak</Option>
											<Option value="Irán">Irán</Option>
											<Option value="Irlanda">
												Irlanda
											</Option>
											<Option value="Islandia">
												Islandia
											</Option>
											<Option value="Islas Marshall">
												Islas Marshall
											</Option>
											<Option value="Islas Salomón">
												Islas Salomón
											</Option>
											<Option value="Israel">
												Israel
											</Option>
											<Option value="Italia">
												Italia
											</Option>
											<Option value="Jamaica">
												Jamaica
											</Option>
											<Option value="Japón">Japón</Option>
											<Option value="Jordania">
												Jordania
											</Option>
											<Option value="Kazajistán">
												Kazajistán
											</Option>
											<Option value="Kenia">Kenia</Option>
											<Option value="Kirguistán">
												Kirguistán
											</Option>
											<Option value="Kiribati">
												Kiribati
											</Option>
											<Option value="Kuwait">
												Kuwait
											</Option>
											<Option value="Laos">Laos</Option>
											<Option value="Lesoto">
												Lesoto
											</Option>
											<Option value="Letonia">
												Letonia
											</Option>
											<Option value="Líbano">
												Líbano
											</Option>
											<Option value="Liberia">
												Liberia
											</Option>
											<Option value="Libia">Libia</Option>
											<Option value="Liechtenstein">
												Liechtenstein
											</Option>
											<Option value="Lituania">
												Lituania
											</Option>
											<Option value="Luxemburgo">
												Luxemburgo
											</Option>
											<Option value="Macedonia del Norte">
												Macedonia del Norte
											</Option>
											<Option value="Madagascar">
												Madagascar
											</Option>
											<Option value="Malasia">
												Malasia
											</Option>
											<Option value="Malaui">
												Malaui
											</Option>
											<Option value="Maldivas">
												Maldivas
											</Option>
											<Option value="Malí">Malí</Option>
											<Option value="Malta">Malta</Option>
											<Option value="Marruecos">
												Marruecos
											</Option>
											<Option value="Mauricio">
												Mauricio
											</Option>
											<Option value="Mauritania">
												Mauritania
											</Option>
											<Option value="México">
												México
											</Option>
											<Option value="Micronesia">
												Micronesia
											</Option>
											<Option value="Moldavia">
												Moldavia
											</Option>
											<Option value="Mónaco">
												Mónaco
											</Option>
											<Option value="Mongolia">
												Mongolia
											</Option>
											<Option value="Montenegro">
												Montenegro
											</Option>
											<Option value="Mozambique">
												Mozambique
											</Option>
											<Option value="Namibia">
												Namibia
											</Option>
											<Option value="Nauru">Nauru</Option>
											<Option value="Nepal">Nepal</Option>
											<Option value="Nicaragua">
												Nicaragua
											</Option>
											<Option value="Níger">Níger</Option>
											<Option value="Nigeria">
												Nigeria
											</Option>
											<Option value="Noruega">
												Noruega
											</Option>
											<Option value="Nueva Zelanda">
												Nueva Zelanda
											</Option>
											<Option value="Omán">Omán</Option>
											<Option value="Países Bajos">
												Países Bajos
											</Option>
											<Option value="Pakistán">
												Pakistán
											</Option>
											<Option value="Palaos">
												Palaos
											</Option>
											<Option value="Panamá">
												Panamá
											</Option>
											<Option value="Papúa Nueva Guinea">
												Papúa Nueva Guinea
											</Option>
											<Option value="Paraguay">
												Paraguay
											</Option>
											<Option value="Perú">Perú</Option>
											<Option value="Polonia">
												Polonia
											</Option>
											<Option value="Portugal">
												Portugal
											</Option>
											<Option value="Reino Unido">
												Reino Unido
											</Option>
											<Option value="República Centroafricana">
												República Centroafricana
											</Option>
											<Option value="República Checa">
												República Checa
											</Option>
											<Option value="República del Congo">
												República del Congo
											</Option>
											<Option value="República Democrática del Congo">
												República Democrática del Congo
											</Option>
											<Option value="República Dominicana">
												República Dominicana
											</Option>
											<Option value="Ruanda">
												Ruanda
											</Option>
											<Option value="Rumanía">
												Rumanía
											</Option>
											<Option value="Rusia">Rusia</Option>
											<Option value="Samoa">Samoa</Option>
											<Option value="San Cristóbal y Nieves">
												San Cristóbal y Nieves
											</Option>
											<Option value="San Marino">
												San Marino
											</Option>
											<Option value="San Vicente y las Granadinas">
												San Vicente y las Granadinas
											</Option>
											<Option value="Santa Lucía">
												Santa Lucía
											</Option>
											<Option value="Santo Tomé y Príncipe">
												Santo Tomé y Príncipe
											</Option>
											<Option value="Senegal">
												Senegal
											</Option>
											<Option value="Serbia">
												Serbia
											</Option>
											<Option value="Seychelles">
												Seychelles
											</Option>
											<Option value="Sierra Leona">
												Sierra Leona
											</Option>
											<Option value="Singapur">
												Singapur
											</Option>
											<Option value="Siria">Siria</Option>
											<Option value="Somalia">
												Somalia
											</Option>
											<Option value="Sri Lanka">
												Sri Lanka
											</Option>
											<Option value="Suazilandia">
												Suazilandia
											</Option>
											<Option value="Sudáfrica">
												Sudáfrica
											</Option>
											<Option value="Sudán">Sudán</Option>
											<Option value="Sudán del Sur">
												Sudán del Sur
											</Option>
											<Option value="Suecia">
												Suecia
											</Option>
											<Option value="Suiza">Suiza</Option>
											<Option value="Surinam">
												Surinam
											</Option>
											<Option value="Tailandia">
												Tailandia
											</Option>
											<Option value="Tanzania">
												Tanzania
											</Option>
											<Option value="Tayikistán">
												Tayikistán
											</Option>
											<Option value="Timor Oriental">
												Timor Oriental
											</Option>
											<Option value="Togo">Togo</Option>
											<Option value="Tonga">Tonga</Option>
											<Option value="Trinidad y Tobago">
												Trinidad y Tobago
											</Option>
											<Option value="Túnez">Túnez</Option>
											<Option value="Turkmenistán">
												Turkmenistán
											</Option>
											<Option value="Turquía">
												Turquía
											</Option>
											<Option value="Tuvalu">
												Tuvalu
											</Option>
											<Option value="Ucrania">
												Ucrania
											</Option>
											<Option value="Uganda">
												Uganda
											</Option>
											<Option value="Uruguay">
												Uruguay
											</Option>
											<Option value="Uzbekistán">
												Uzbekistán
											</Option>
											<Option value="Vanuatu">
												Vanuatu
											</Option>
											<Option value="Venezuela">
												Venezuela
											</Option>
											<Option value="Vietnam">
												Vietnam
											</Option>
											<Option value="Yemen">Yemen</Option>
											<Option value="Yibuti">
												Yibuti
											</Option>
											<Option value="Zambia">
												Zambia
											</Option>
											<Option value="Zimbabue">
												Zimbabue
											</Option>
										</Select>
									</div>
								) : null}
								{data.adress ? (
									<div
										className={`${
											!even && lastOdd === "adress"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="adress"
											type="text"
											name="adress"
											label="Dirección"
											variant="filled"
											value={inputs.adress}
											onChange={inputValidation}
										/>
									</div>
								) : null}
								{data.other ? (
									<div
										className={`${
											!even && lastOdd === "other"
												? "odd"
												: "mitad"
										}`}
									>
										<TextField
											id="otherText"
											type="text"
											name="otherText"
											label={data.otherText}
											variant="filled"
											value={inputs.otherText}
											onChange={inputValidation}
										/>
									</div>
								) : null}
							</Form>
						) : null}
					</div>
				</Spin>
			</Drawer>
		</ConfigProvider>
	);
}
