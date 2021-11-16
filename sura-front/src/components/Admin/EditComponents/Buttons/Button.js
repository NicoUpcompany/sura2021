/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	Spin,
	Table,
	Input,
	Space,
	Button,
	DatePicker,
	notification,
	Modal,
	Popconfirm,
	Divider,
	Select,
	TimePicker,
	InputNumber,
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	ArrowLeftOutlined,
} from "@ant-design/icons";
import AddIcon from "@material-ui/icons/Add";
import {
	sortableContainer,
	sortableElement,
	sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import Highlighter from "react-highlight-words";
import moment from "moment";
import "moment/locale/es";

import {
	getButtonApi,
	postButtonApi,
	putButtonApi,
	deleteButtonApi,
	putUploadFileApi,
} from "../../../../api/Admin/button";

import { postAgendaStandApi } from "../../../../api/Admin/agendaStand";

import "./Button.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const ButtonComponent = (props) => {
	const { token, setStandStatus, standId } = props;

	const format = "HH:mm";

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [state, setState] = useState(false);
	const [state2, setState2] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [fileInput, setFileInput] = useState(null);
	const [fileInput2, setFileInput2] = useState(null);
	const [selectedButtonType, setSelectedBttonType] = useState("whatsapp");
	const [selectedButtonType2, setSelectedBttonType2] = useState("whatsapp");
	const [labelInput, setLabelInput] = useState("Adjuntar archivo");
	const [labelInput2, setLabelInput2] = useState("Adjuntar archivo");
	const [updatedDateId, setUpdatedDateId] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({
		order: 0,
		text: "",
		whatsapp: false,
		whatsappNumber: "",
		whatsappText: "",
		file: false,
		fileName: "",
		redirect: false,
		redirectUrl: "",
		agenda: false,
		agendaDays: [],
		stand: standId,
	});
	const [updatedOptions, setUpdatedOptions] = useState({
		order: 0,
		text: "",
		whatsapp: false,
		whatsappNumber: "",
		whatsappText: "",
		file: false,
		fileName: "",
		redirect: false,
		redirectUrl: "",
		agenda: false,
		agendaDays: [],
		stand: standId,
	});
	const [agendaObj, setAgendaObj] = useState({
		startTimeYear: "",
		startTimeMonth: "",
		startTimeDay: "",
		startTimeHour: "",
		startTimeMinute: "",
		startTimeSecond: "",
		endTimeYear: "",
		endTimeMonth: "",
		endTimeDay: "",
		endTimeHour: "",
		endTimeMinute: "",
		endTimeSecond: "",
		duration: 0,
		type: "minutes",
		rest: 0,
		typeRest: "minutes",
		days: "",
		owner: "",
		button: "",
		weekend: true,
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getButtonApi(token, standId);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.buttons.forEach((item) => {
				let element = {
					...item,
					index: cont,
					key: item._id,
				};
				if (item.whatsapp) {
					element = {
						...element,
						whatsappAux: "Si",
					};
				} else {
					element = {
						...element,
						whatsappAux: "No",
					};
				}
				if (item.file) {
					element = {
						...element,
						fileAux: "Si",
					};
				} else {
					element = {
						...element,
						fileAux: "No",
					};
				}
				if (item.redirect) {
					element = {
						...element,
						redirectAux: "Si",
					};
				} else {
					element = {
						...element,
						redirectAux: "No",
					};
				}
				if (item.agenda) {
					element = {
						...element,
						agendaAux: "Si",
					};
				} else {
					element = {
						...element,
						agendaAux: "No",
					};
				}
				array.push(element);
				cont = cont + 1;
			});
			setFunctionStatus(true);
			setDataSource(array);
			setLoading(false);
			setConfirmLoading(false);
			setConfirmLoading2(false);
			setVisible(false);
			setVisible2(false);
		} else {
			setFunctionStatus(false);
			setLoading(false);
			setConfirmLoading(false);
			setConfirmLoading2(false);
			setVisible(false);
			setVisible2(false);
		}
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMove(
				[].concat(dataSource),
				oldIndex,
				newIndex
			).filter((el) => !!el);
			let cont = 0;
			newData.forEach((item) => {
				item.order = cont;
				cont = cont + 1;
				putButtonApi(token, item, item._id);
			});
			setDataSource(newData);
		}
	};

	const DraggableContainer = (props) => (
		<SortableContainer
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const DraggableBodyRow = ({ className, style, ...restProps }) => {
		if (functionStatus) {
			const index = dataSource.findIndex(
				(x) => x.index === restProps["data-row-key"]
			);
			return <SortableItem index={index} {...restProps} />;
		}
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

	const columns = [
		{
			title: "Orden",
			dataIndex: "order",
			width: 30,
			className: "drag-visible",
			render: () => <DragHandle />,
		},
		{
			title: "ID",
			dataIndex: "_id",
			width: 100,
			className: "drag-visible",
			...getColumnSearchProps("_id"),
		},
		{
			title: "Texto",
			dataIndex: "text",
			className: "drag-visible",
			...getColumnSearchProps("text"),
		},
		{
			title: "WhatsApp",
			dataIndex: "whatsappAux",
			className: "drag-visible",
		},
		{
			title: "Número WhatsApp",
			dataIndex: "whatsappNumber",
			className: "drag-visible",
			...getColumnSearchProps("whatsappNumber"),
		},
		{
			title: "Texto WhatsApp",
			dataIndex: "whatsappText",
			className: "drag-visible",
			...getColumnSearchProps("whatsappText"),
		},
		{
			title: "Archivo descargable",
			dataIndex: "fileAux",
			className: "drag-visible",
		},
		{
			title: "Redirección Url",
			dataIndex: "redirectAux",
			className: "drag-visible",
		},
		{
			title: "Link redirección",
			dataIndex: "redirectUrl",
			className: "drag-visible",
			...getColumnSearchProps("redirectUrl"),
		},
		{
			title: "Agendamiento",
			dataIndex: "agendaAux",
			className: "drag-visible",
		},
		{
			title: "Opciones",
			key: "operation",
			fixed: "right",
			render: (text, record) => (
				<>
					{record.agenda ? null : (
						<>
							<span
								style={{
									cursor: "pointer",
									color: "#1890FF",
									margin: "0 5px",
								}}
								onClick={() => openEditModal(record)}
							>
								Editar{" "}
								<EditTwoTone style={{ margin: "0 5px" }} />
							</span>{" "}
							/{" "}
						</>
					)}
					<Popconfirm
						title="Estás segur@?"
						okText="Si"
						cancelText="No"
						onConfirm={() => deleteButton(record)}
					>
						<span
							style={{
								cursor: "pointer",
								color: "#eb2f96",
								margin: "0 5px",
							}}
						>
							Eliminar
							<DeleteTwoTone
								style={{ margin: "0 5px" }}
								twoToneColor="#eb2f96"
							/>
						</span>
					</Popconfirm>
				</>
			),
		},
	];

	const openEditModal = (button) => {
		setUpdatedDateId(button._id);
		setUpdatedOptions({
			order: button.order,
			text: button.text,
			whatsapp: button.whatsapp,
			whatsappNumber: button.whatsappNumber,
			whatsappText: button.whatsappText,
			file: button.file,
			fileName: button.fileName,
			redirect: button.redirect,
			redirectUrl: button.redirectUrl,
			agenda: button.agenda,
			agendaDays: button.agendaDays,
		});
		if (button.whatsapp) {
			setSelectedBttonType2("whatsapp");
		} else if (button.file) {
			setSelectedBttonType2("file");
		} else {
			setSelectedBttonType2("redirect");
		}
		setVisible2(true);
	};

	const saveButton = async () => {
		setLoading(true);
		setConfirmLoading(true);
		if (selectedOptions.text.trim().length === 0) {
			notification["error"]({
				message: "El campo texto es obligatorio",
			});
			setLoading(false);
			setConfirmLoading(false);
		} else {
			if (selectedButtonType === "whatsapp") {
				if (selectedOptions.whatsappNumber.trim().length === 0) {
					notification["error"]({
						message: "El número de WhastApp es obligatorio",
					});
					setLoading(false);
					setConfirmLoading(false);
				} else if (selectedOptions.whatsappText.trim().length === 0) {
					notification["error"]({
						message: "El mensaje automático es obligatorio",
					});
					setLoading(false);
					setConfirmLoading(false);
				} else {
					let data = selectedOptions;
					data = {
						...data,
						whatsapp: true,
					};
					const resp = await postButtonApi(token, data);
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
						setConfirmLoading(false);
					}
				}
			} else if (selectedButtonType === "file") {
				if (state) {
					let data = selectedOptions;
					data = {
						...data,
						file: true,
					};

					const resp = await postButtonApi(token, data);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const buttonId = resp.buttonId;

							
						console.log("Token" + token);
						console.log("FIle" + fileInput);
						console.log("ButtonId" + buttonId)

						if (fileInput !== null) {
							console.log(1)
							const result = await putUploadFileApi(
								token,
								fileInput,
								buttonId
							);
							if (result.ok) {
								notification["success"]({
									message: "Archivo subido correctamente",
								});
							} else {
								notification["error"]({
									message: result.message,
								});
							}
							getData();
						} else {
							notification["error"]({
								message: "Debes subir un archivo",
							});
							setLoading(false);
							setConfirmLoading(false);
						}
					} else {
						notification["error"]({
							message: resp.message,
						});
						setLoading(false);
						setConfirmLoading(false);
					}
				} else {
					notification["error"]({
						message: "Debes subir un archivo válido",
					});
					setLoading(false);
					setConfirmLoading(false);
				}
			} else if (selectedButtonType === "redirect") {
				if (selectedOptions.redirectUrl.trim().length === 0) {
					notification["error"]({
						message: "El link es obligatorio",
					});
					setLoading(false);
					setConfirmLoading(false);
				} else {
					let data = selectedOptions;
					data = {
						...data,
						redirect: true,
					};
					const resp = await postButtonApi(token, data);
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
						setConfirmLoading(false);
					}
				}
			} else if (selectedButtonType === "agenda") {
				const data = {
					...selectedOptions,
					agenda: true,
				};
				const resp = await postButtonApi(token, data);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const data2 = {
						...agendaObj,
						button: resp.buttonId,
					};
					const result = await postAgendaStandApi(token, data2);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
					getData();
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
					setConfirmLoading(false);
				}
			} else {
				notification["error"]({
					message: "Opción no válida",
				});
				setLoading(false);
				setConfirmLoading(false);
			}
		}
	};

	const editButton = async () => {
		setLoading(true);
		setConfirmLoading2(true);
		if (updatedOptions.text.trim().length === 0) {
			notification["error"]({
				message: "El campo texto es obligatorio",
			});
			setLoading(false);
			setConfirmLoading2(false);
		} else {
			if (selectedButtonType2 === "whatsapp") {
				if (updatedOptions.whatsappNumber.trim().length === 0) {
					notification["error"]({
						message: "El número de WhastApp es obligatorio",
					});
					setLoading(false);
					setConfirmLoading2(false);
				} else if (updatedOptions.whatsappText.trim().length === 0) {
					notification["error"]({
						message: "El mensaje automático es obligatorio",
					});
					setLoading(false);
					setConfirmLoading2(false);
				} else {
					let data = updatedOptions;
					data = {
						...data,
						whatsapp: true,
						file: false,
						redirect: false,
						agenda: false,
						redirectUrl: "",
					};
					const resp = await putButtonApi(token, data, updatedDateId);
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
						setConfirmLoading2(false);
					}
				}
			} else if (selectedButtonType2 === "file") {
				if (state2) {
					let data = updatedOptions;
					data = {
						...data,
						file: true,
						whatsapp: false,
						redirect: false,
						agenda: false,
						whatsappNumber: "",
						whatsappText: "",
						redirectUrl: "",
					};
					const resp = await putButtonApi(token, data, updatedDateId);
					if (resp.ok) {
						notification["success"]({
							message: resp.message,
						});
						const buttonId = updatedDateId;
						if (fileInput2 !== null) {
							const result = await putUploadFileApi(
								token,
								fileInput2,
								buttonId
							);
							if (result.ok) {
								notification["success"]({
									message: "Archivo subido correctamente",
								});
							} else {
								notification["error"]({
									message: result.message,
								});
							}
						} else {
							notification["error"]({
								message: "Debes subir un archivo",
							});
							setLoading(false);
							setConfirmLoading2(false);
						}
						getData();
					} else {
						notification["error"]({
							message: resp.message,
						});
						setLoading(false);
						setConfirmLoading2(false);
					}
				} else {
					notification["error"]({
						message: "Debes subir un archivo válido",
					});
					setLoading(false);
					setConfirmLoading2(false);
				}
			} else if (selectedButtonType2 === "redirect") {
				if (updatedOptions.redirectUrl.trim().length === 0) {
					notification["error"]({
						message: "El link es obligatorio",
					});
					setLoading(false);
					setConfirmLoading2(false);
				} else {
					let data = updatedOptions;
					data = {
						...data,
						redirect: true,
						file: false,
						whatsapp: false,
						agenda: false,
						whatsappNumber: "",
						whatsappText: "",
					};
					const resp = await putButtonApi(token, data, updatedDateId);
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
						setConfirmLoading2(false);
					}
				}
			} else if (selectedButtonType2 === "agenda") {
				const data = {
					...updatedOptions,
					agenda: true,
					redirect: false,
					file: false,
					whatsapp: false,
					whatsappNumber: "",
					whatsappText: "",
					redirectUrl: "",
				};
				const resp = await putButtonApi(token, data, updatedDateId);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					const data2 = {
						...agendaObj,
						button: updatedDateId,
					};
					const result = await postAgendaStandApi(token, data2);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
					getData();
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
					setConfirmLoading2(false);
				}
			} else {
				notification["error"]({
					message: "Opción no válida",
				});
				setLoading(false);
				setConfirmLoading2(false);
			}
		}
	};

	const deleteButton = async (button) => {
		setLoading(true);
		const resp = await deleteButtonApi(token, button._id);
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
	};

	const onChangeForm = (e) => {
		setSelectedOptions({
			...selectedOptions,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeFormUpdate = (e) => {
		setUpdatedOptions({
			...updatedOptions,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeForm2 = (e) => {
		setAgendaObj({
			...agendaObj,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeFormNumber = (value) => {
		setAgendaObj({
			...agendaObj,
			duration: value,
		});
	};

	const onChangeFormNumber2 = (value) => {
		setAgendaObj({
			...agendaObj,
			rest: value,
		});
	};

	const handleChange = (value) => {
		setSelectedBttonType(value);
	};

	const handleChangeUpdate = (value) => {
		setSelectedBttonType2(value);
	};

	const handleFileChange = (e) => {
		try {
			setLoading(true);
			let extSplit = e.target.files[0].name.split(".");
			let fileExt = extSplit[1];
			if (fileExt !== "pdf" && fileExt !== "rar" && fileExt !== "zip") {
				notification["error"]({
					message:
						"La extension del archivo no es válida. (Extensiones permitidas: .pdf, .rar y .zip)",
				});
				setState(false);
				setLoading(false);
			} else {
				setLabelInput(e.target.files[0].name);
				const kb = e.target.files[0].size / 1000;
				const mg = kb / 1000;
				if (mg > 10) {
					notification["error"]({
						message: "El peso del archivo no debe superar los 10 MB",
					});
					setState(false);
				} else {
					setFileInput(e.target.files[0]);
					setState(true);
				}
				setLoading(false);
			}
		} catch (error) {
			notification["error"]({
				message: "Error al subir el archivo",
			});
			setState(false);
		}
		setLoading(false);
	};

	const handleFileChangeUpdate = (e) => {
		try {
			setLoading(true);
			let extSplit = e.target.files[0].name.split(".");
			let fileExt = extSplit[1];
			if (fileExt !== "pdf" && fileExt !== "rar" && fileExt !== "zip") {
				notification["error"]({
					message:
						"La extension del archivo no es válida. (Extensiones permitidas: .pdf, .rar y .zip)",
				});
				setState2(false);
				setLoading(false);
			} else {
				setLabelInput2(e.target.files[0].name);
				const kb = e.target.files[0].size / 1000;
				const mg = kb / 1000;
				if (mg > 10) {
					notification["error"]({
						message: "El peso del archivo no debe superar los 10 MB",
					});
					setState2(false);
				} else {
					setFileInput2(e.target.files[0]);
					setState2(true);
				}
				setLoading(false);
			}
		} catch (error) {
			notification["error"]({
				message: "Error al subir el archivo",
			});
			setState2(false);
		}
		setLoading(false);
	};

	const onChangeDate = (date, dateString) => {
		try {
			if (date.length > 0) {
				const date1 = moment(date[0]).valueOf();
				const date2 = moment(date[1]).add(1, "days").valueOf();

				const distance = date2 - date1;
				const days_t = Math.floor(distance / (1000 * 60 * 60 * 24));

				const m1 = String(days_t).substring(0, 1);
				const m2 = String(days_t).substring(1, 2);
				const days = m1 + m2;

				setAgendaObj({
					...agendaObj,
					startTimeYear: moment(date[0]).year(),
					startTimeMonth: moment(date[0]).month(),
					startTimeDay: moment(date[0]).date(),
					endTimeYear: moment(date[0]).year(),
					endTimeMonth: moment(date[0]).month(),
					endTimeDay: moment(date[0]).date(),
					days,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onChangeTime = (time, timeString) => {
		try {
			if (time.length > 0) {
				setAgendaObj({
					...agendaObj,
					startTimeHour: moment(time[0]).hours(),
					startTimeMinute: moment(time[0]).minutes(),
					startTimeSecond: 0,
					endTimeHour: moment(time[1]).hours(),
					endTimeMinute: moment(time[1]).minutes(),
					endTimeSecond: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSelectChange = (value) => {
		setAgendaObj({
			...agendaObj,
			type: value,
		});
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-button">
				{functionStatus ? (
					<div className="container-table">
						<Button
							type="primary"
							className="arrow"
							onClick={() => setStandStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otro botón
						</Button>
						<Table
							pagination={false}
							dataSource={dataSource}
							columns={columns}
							rowKey="index"
							components={{
								body: {
									wrapper: DraggableContainer,
									row: DraggableBodyRow,
								},
							}}
						/>
					</div>
				) : (
					<div className="container">
						<Button
							type="primary"
							className="arrow"
							onClick={() => setStandStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<h1 className="title">Crear Botón</h1>
						<Divider orientation="center" plain>
							Texto
						</Divider>
						<Input
							placeholder={"Texto"}
							onChange={onChangeForm}
							id="text"
							name="text"
							type="text"
							className="input-ant"
							value={selectedOptions.text}
						/>
						<Divider orientation="center" plain>
							Tipo
						</Divider>
						<Select
							value={selectedButtonType}
							onChange={handleChange}
							className="select-ant"
						>
							<Option value="whatsapp">WhatsApp</Option>
							<Option value="file">Archivo</Option>
							<Option value="redirect">Redirección</Option>
							<Option value="agenda">Agendamiento</Option>
						</Select>
						{selectedButtonType === "whatsapp" ? (
							<>
								<Divider orientation="center" plain>
									Número WhatsApp
								</Divider>
								<Input
									placeholder={"Número WhatsApp"}
									onChange={onChangeForm}
									id="whatsappNumber"
									name="whatsappNumber"
									type="text"
									className="input-ant"
									value={selectedOptions.whatsappNumber}
								/>
								<Divider orientation="center" plain>
									Mensaje automático
								</Divider>
								<Input
									placeholder={"Mensaje automático"}
									onChange={onChangeForm}
									id="whatsappText"
									name="whatsappText"
									type="text"
									className="input-ant"
									value={selectedOptions.whatsappText}
								/>
							</>
						) : null}
						{selectedButtonType === "file" ? (
							<>
								<Divider orientation="center" plain>
									Subir archivo
								</Divider>
								<div className="upload-file">
									<input
										type="file"
										id="file"
										name="file"
										className="file"
										onChange={handleFileChange}
									/>
									<label htmlFor="file" className="labelFile">
										{labelInput}{" "}
										<div>
											<AddIcon className="icon" />
										</div>{" "}
									</label>
								</div>
							</>
						) : null}
						{selectedButtonType === "redirect" ? (
							<>
								<Divider orientation="center" plain>
									Link redirección
								</Divider>
								<Input
									placeholder={"Link redirección"}
									onChange={onChangeForm}
									id="redirectUrl"
									name="redirectUrl"
									type="text"
									className="input-ant"
									value={selectedOptions.redirectUrl}
								/>
							</>
						) : null}
						{selectedButtonType === "agenda" ? (
							<>
								<Divider orientation="center" plain>
									Días agenda
								</Divider>
								<RangePicker
									disabledDate={disabledDate}
									onChange={onChangeDate}
								/>
								<Divider orientation="center" plain>
									Horario agenda
								</Divider>
								<TimePicker.RangePicker
									format={format}
									onChange={onChangeTime}
								/>
								<Divider orientation="center" plain>
									Duración reuniones
								</Divider>
								<div className="duration-time">
									<Input.Group compact>
										<Select
											value={agendaObj.type}
											onChange={handleSelectChange}
										>
											<Option value="minutes">
												Minutos
											</Option>
											<Option value="hours">Horas</Option>
										</Select>
										<InputNumber
											onChange={onChangeFormNumber}
											value={agendaObj.duration}
											min={0}
										/>
									</Input.Group>
								</div>
								<Divider orientation="center" plain>
									Receso entre reuniones
								</Divider>
								<div className="duration-time">
									<Input.Group compact>
										<Select value={agendaObj.typeRest}>
											<Option value="minutes">
												Minutos
											</Option>
											<Option value="hours">Horas</Option>
										</Select>
										<InputNumber
											onChange={onChangeFormNumber2}
											value={agendaObj.rest}
											min={0}
										/>
									</Input.Group>
								</div>
								<Divider orientation="center" plain>
									ID Ejecutivo
								</Divider>
								<Input
									placeholder={"Id ejecutivo"}
									onChange={onChangeForm2}
									id="owner"
									name="owner"
									type="text"
									className="input-ant"
								/>
							</>
						) : null}
						<Button
							type="primary"
							className="btn"
							onClick={saveButton}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otro botón"
				visible={visible}
				onOk={saveButton}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
				width={700}
			>
				<div className="container">
					<h3 className="title">Agregar</h3>
					<Divider orientation="center" plain>
						Texto
					</Divider>
					<Input
						placeholder={"Texto"}
						onChange={onChangeForm}
						id="text"
						name="text"
						type="text"
						className="input-ant"
						value={selectedOptions.text}
					/>
					<Divider orientation="center" plain>
						Tipo
					</Divider>
					<Select
						value={selectedButtonType}
						onChange={handleChange}
						className="select-ant"
					>
						<Option value="whatsapp">WhatsApp</Option>
						<Option value="file">Archivo</Option>
						<Option value="redirect">Redirección</Option>
						<Option value="agenda">Agendamiento</Option>
					</Select>
					{selectedButtonType === "whatsapp" ? (
						<>
							<Divider orientation="center" plain>
								Número WhatsApp
							</Divider>
							<Input
								placeholder={"Número WhatsApp"}
								onChange={onChangeForm}
								id="whatsappNumber"
								name="whatsappNumber"
								type="text"
								className="input-ant"
								value={selectedOptions.whatsappNumber}
							/>
							<Divider orientation="center" plain>
								Mensaje automático
							</Divider>
							<Input
								placeholder={"Mensaje automático"}
								onChange={onChangeForm}
								id="whatsappText"
								name="whatsappText"
								type="text"
								className="input-ant"
								value={selectedOptions.whatsappText}
							/>
						</>
					) : null}
					{selectedButtonType === "file" ? (
						<>
							<Divider orientation="center" plain>
								Subir archivo
							</Divider>
							<div className="upload-file">
								<input
									type="file"
									id="file"
									name="file"
									className="file"
									onChange={handleFileChange}
								/>
								<label htmlFor="file" className="labelFile">
									{labelInput}{" "}
									<div>
										<AddIcon className="icon" />
									</div>{" "}
								</label>
							</div>
						</>
					) : null}
					{selectedButtonType === "redirect" ? (
						<>
							<Divider orientation="center" plain>
								Link redirección
							</Divider>
							<Input
								placeholder={"Link redirección"}
								onChange={onChangeForm}
								id="redirectUrl"
								name="redirectUrl"
								type="text"
								className="input-ant"
								value={selectedOptions.redirectUrl}
							/>
						</>
					) : null}
					{selectedButtonType === "agenda" ? (
						<>
							<Divider orientation="center" plain>
								Días agenda
							</Divider>
							<RangePicker
								disabledDate={disabledDate}
								onChange={onChangeDate}
							/>
							<Divider orientation="center" plain>
								Horario agenda
							</Divider>
							<TimePicker.RangePicker
								format={format}
								onChange={onChangeTime}
							/>
							<Divider orientation="center" plain>
								Duración reuniones
							</Divider>
							<div className="duration-time">
								<Input.Group compact>
									<Select
										value={agendaObj.type}
										onChange={handleSelectChange}
									>
										<Option value="minutes">Minutos</Option>
										<Option value="hours">Horas</Option>
									</Select>
									<InputNumber
										onChange={onChangeFormNumber}
										value={agendaObj.duration}
										min={0}
									/>
								</Input.Group>
							</div>
							<Divider orientation="center" plain>
								Receso entre reuniones
							</Divider>
							<div className="duration-time">
								<Input.Group compact>
									<Select value={agendaObj.typeRest}>
										<Option value="minutes">Minutos</Option>
										<Option value="hours">Horas</Option>
									</Select>
									<InputNumber
										onChange={onChangeFormNumber2}
										value={agendaObj.rest}
										min={0}
									/>
								</Input.Group>
							</div>
							<Divider orientation="center" plain>
								ID Ejecutivo
							</Divider>
							<Input
								placeholder={"Id ejecutivo"}
								onChange={onChangeForm2}
								id="owner"
								name="owner"
								type="text"
								className="input-ant"
							/>
						</>
					) : null}
				</div>
			</Modal>
			<Modal
				title="Editar Botón"
				visible={visible2}
				onOk={editButton}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<h3 className="title">Editar Botón</h3>
				<div className="container">
					<Divider orientation="center" plain>
						Texto
					</Divider>
					<Input
						placeholder={"Texto"}
						onChange={onChangeFormUpdate}
						id="text"
						name="text"
						type="text"
						className="input-ant"
						value={updatedOptions.text}
					/>
					<Divider orientation="center" plain>
						Tipo
					</Divider>
					<Select
						value={selectedButtonType2}
						onChange={handleChangeUpdate}
						className="select-ant"
					>
						<Option value="whatsapp">WhatsApp</Option>
						<Option value="file">Archivo</Option>
						<Option value="redirect">Redirección</Option>
						<Option value="agenda">Agendamiento</Option>
					</Select>
					{selectedButtonType2 === "whatsapp" ? (
						<>
							<Divider orientation="center" plain>
								Número WhatsApp
							</Divider>
							<Input
								placeholder={"Número WhatsApp"}
								onChange={onChangeFormUpdate}
								id="whatsappNumber"
								name="whatsappNumber"
								type="text"
								className="input-ant"
								value={updatedOptions.whatsappNumber}
							/>
							<Divider orientation="center" plain>
								Mensaje automático
							</Divider>
							<Input
								placeholder={"Mensaje automático"}
								onChange={onChangeFormUpdate}
								id="whatsappText"
								name="whatsappText"
								type="text"
								className="input-ant"
								value={updatedOptions.whatsappText}
							/>
						</>
					) : null}
					{selectedButtonType2 === "file" ? (
						<>
							<Divider orientation="center" plain>
								Subir archivo
							</Divider>
							<div className="upload-file">
								<input
									type="file"
									id="file2"
									name="file2"
									className="file"
									onChange={handleFileChangeUpdate}
								/>
								<label htmlFor="file2" className="labelFile">
									{labelInput2}{" "}
									<div>
										<AddIcon className="icon" />
									</div>{" "}
								</label>
							</div>
						</>
					) : null}
					{selectedButtonType2 === "redirect" ? (
						<>
							<Divider orientation="center" plain>
								Link redirección
							</Divider>
							<Input
								placeholder={"Link redirección"}
								onChange={onChangeFormUpdate}
								id="redirectUrl"
								name="redirectUrl"
								type="text"
								className="input-ant"
								value={onChangeFormUpdate.redirectUrl}
							/>
						</>
					) : null}
					{selectedButtonType2 === "agenda" ? (
						<>
							<Divider orientation="center" plain>
								Días agenda
							</Divider>
							<RangePicker
								disabledDate={disabledDate}
								onChange={onChangeDate}
							/>
							<Divider orientation="center" plain>
								Horario agenda
							</Divider>
							<TimePicker.RangePicker
								format={format}
								onChange={onChangeTime}
							/>
							<Divider orientation="center" plain>
								Duración reuniones
							</Divider>
							<div className="duration-time">
								<Input.Group compact>
									<Select
										value={agendaObj.type}
										onChange={handleSelectChange}
									>
										<Option value="minutes">Minutos</Option>
										<Option value="hours">Horas</Option>
									</Select>
									<InputNumber
										onChange={onChangeFormNumber}
										value={agendaObj.duration}
										min={0}
									/>
								</Input.Group>
							</div>
							<Divider orientation="center" plain>
								Receso entre reuniones
							</Divider>
							<div className="duration-time">
								<Input.Group compact>
									<Select value={agendaObj.typeRest}>
										<Option value="minutes">Minutos</Option>
										<Option value="hours">Horas</Option>
									</Select>
									<InputNumber
										onChange={onChangeFormNumber2}
										value={agendaObj.rest}
										min={0}
									/>
								</Input.Group>
							</div>
							<Divider orientation="center" plain>
								ID Ejecutivo
							</Divider>
							<Input
								placeholder={"Id ejecutivo"}
								onChange={onChangeForm2}
								id="owner"
								name="owner"
								type="text"
								className="input-ant"
							/>
						</>
					) : null}
				</div>
			</Modal>
		</Spin>
	);
};

export default ButtonComponent;

function disabledDate(current) {
	return current && current < moment().endOf("day");
}
