/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import {
	Spin,
	Table,
	Input,
	Space,
	Button,
	notification,
	Modal,
	Popconfirm,
	Carousel,
	Divider,
	Avatar,
	Tooltip,
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	EyeTwoTone,
	QuestionCircleTwoTone,
} from "@ant-design/icons";
import {
	sortableContainer,
	sortableElement,
	sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import Highlighter from "react-highlight-words";
import { useDropzone } from "react-dropzone";

import {
	getStandApi,
	postStandApi,
	putStandApi,
	deleteStandApi,
	putUploadImageApi,
} from "../../../../api/Admin/stands";
import { basePath, apiVersion } from "../../../../api/config";

import "./Stands.scss";

const { TextArea } = Input;

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Stand = (props) => {
	const { token, setStandStatus, setStandId } = props;

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [header, setHeader] = useState(null);
	const [logoExt, setLogoExt] = useState(null);
	const [logo, setLogo] = useState(null);
	const [image1, setImage1] = useState(null);
	const [image2, setImage2] = useState(null);
	const [image3, setImage3] = useState(null);
	const [image4, setImage4] = useState(null);
	const [image5, setImage5] = useState(null);
	const [image6, setImage6] = useState(null);
	const [headerUpdate, setHeaderUpdate] = useState(null);
	const [logoExtUpdate, setLogoExtUpdate] = useState(null);
	const [logoUpdate, setLogoUpdate] = useState(null);
	const [image1Update, setImage1Update] = useState(null);
	const [image2Update, setImage2Update] = useState(null);
	const [image3Update, setImage3Update] = useState(null);
	const [image4Update, setImage4Update] = useState(null);
	const [image5Update, setImage5Update] = useState(null);
	const [image6Update, setImage6Update] = useState(null);
	const [selectedStand, setSelectedStand] = useState({
		order: 0,
		logoExt: "",
		logo: "",
		name: "",
		type: "L",
		phone: "",
		email: "",
		page: "",
		title: "",
		description: "",
		header: "",
		banner: "",
		video: "",
		image1: "",
		redirect1: "",
		image2: "",
		redirect2: "",
		image3: "",
		redirect3: "",
		image4: "",
		redirect4: "",
		image5: "",
		redirect5: "",
		image6: "",
		redirect6: "",
	});
	const [updatedStand, setUpdatedStand] = useState({
		order: 0,
		logoExt: "",
		logo: "",
		name: "",
		type: "L",
		phone: "",
		email: "",
		page: "",
		title: "",
		description: "",
		header: "",
		banner: "",
		video: "",
		image1: "",
		redirect1: "",
		image2: "",
		redirect2: "",
		image3: "",
		redirect3: "",
		image4: "",
		redirect4: "",
		image5: "",
		redirect5: "",
		image6: "",
		redirect6: "",
	});
	const [updatedStandId, setUpdatedStandId] = useState("");

	useEffect(() => {
		if (header) {
			setSelectedStand({
				...selectedStand,
				header: header.file,
			});
		}
		if (logoExt) {
			setSelectedStand({
				...selectedStand,
				logoExt: logoExt.file,
			});
		}
		if (logo) {
			setSelectedStand({
				...selectedStand,
				logo: logo.file,
			});
		}
		if (image1) {
			setSelectedStand({
				...selectedStand,
				image1: image1.file,
			});
		}
		if (image2) {
			setSelectedStand({
				...selectedStand,
				image2: image2.file,
			});
		}
		if (image3) {
			setSelectedStand({
				...selectedStand,
				image3: image3.file,
			});
		}
		if (image4) {
			setSelectedStand({
				...selectedStand,
				image4: image4.file,
			});
		}
		if (image5) {
			setSelectedStand({
				...selectedStand,
				image5: image5.file,
			});
		}
		if (image6) {
			setSelectedStand({
				...selectedStand,
				image6: image6.file,
			});
		}
	}, [header, logoExt, logo, image1, image2, image3, image4, image5, image6]);

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	useEffect(() => {
		console.log(selectedStand.logoExt)
	}, [selectedStand]);

	const getData = async () => {
		const resp = await getStandApi(token);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.stands.forEach((item) => {
				const arrayGalery = [];
				if (item.image1.length > 0) {
					arrayGalery.push(item.image1);
				}
				if (item.image2.length > 0) {
					arrayGalery.push(item.image2);
				}
				if (item.image3.length > 0) {
					arrayGalery.push(item.image3);
				}
				if (item.image4.length > 0) {
					arrayGalery.push(item.image4);
				}
				if (item.image5.length > 0) {
					arrayGalery.push(item.image5);
				}
				if (item.image6.length > 0) {
					arrayGalery.push(item.image6);
				}
				console.log(item.logoExt)
				const element = {
					...item,
					index: cont,
					key: item._id,
					link: (
						<a href={item.video} target="_blank" rel="noreferrer">
							{item.video}
						</a>
					),
					logoExtAux: item.logoExt,
					logoExt: (
						<Avatar
							style={{
								position: "relative",
								display: "block",
								margin: "auto",
								width: "100px",
								heigth: "100px",
							}}
							src={`${basePath}/${apiVersion}/stand-image/${item.logoExt}`}
						/>
					),
					logoAux: item.logo,
					logo: (
						<Avatar
							style={{
								position: "relative",
								display: "block",
								margin: "auto",
								width: "100px",
								heigth: "100px",
							}}
							src={`${basePath}/${apiVersion}/stand-image/${item.logo}`}
						/>
					),
					headerAux: item.header,
					header: (
						<Avatar
							style={{
								position: "relative",
								display: "block",
								margin: "auto",
								width: "200px",
							}}
							src={`${basePath}/${apiVersion}/stand-image/${item.header}`}
						/>
					),
					galery: (
						<>
							<Carousel>
								{arrayGalery.map((aux, i) => {
									return (
										<div key={i}>
											<Avatar
												style={{
													position: "relative",
													display: "block",
													margin: "auto",
													width: "200px",
												}}
												src={`${basePath}/${apiVersion}/stand-image/${aux}`}
											/>
										</div>
									);
								})}
							</Carousel>
						</>
					),
				};
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
				putStandApi(token, item, item._id);
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
			title: "Logo Exterior",
			dataIndex: "logoExt",
			width: "100px",
			heigth: "100px",
		},
		{
			title: "Logo",
			dataIndex: "logo",
			width: "100px",
			heigth: "100px",
		},
		{
			title: "Nombre",
			dataIndex: "name",
			className: "drag-visible",
			...getColumnSearchProps("name"),
		},
		{
			title: "Tipo",
			dataIndex: "type",
			width: 30,
			className: "drag-visible",
			...getColumnSearchProps("type"),
		},
		{
			title: "Título",
			dataIndex: "title",
			className: "drag-visible",
			...getColumnSearchProps("title"),
		},
		{
			title: "Descripción",
			dataIndex: "description",
			className: "drag-visible",
			...getColumnSearchProps("description"),
		},
		{
			title: "Teléfono",
			dataIndex: "phone",
			className: "drag-visible",
			...getColumnSearchProps("phone"),
		},
		{
			title: "Correo",
			dataIndex: "email",
			className: "drag-visible",
			...getColumnSearchProps("email"),
		},
		{
			title: "Página web",
			dataIndex: "page",
			className: "drag-visible",
			...getColumnSearchProps("page"),
		},
		{
			title: "Header",
			dataIndex: "header",
		},
		{
			title: "Link video",
			dataIndex: "link",
			className: "drag-visible",
			...getColumnSearchProps("video"),
		},
		{
			title: "Galería",
			dataIndex: "galery",
			key: "galery",
			width: 250,
		},
		{
			title: "Opciones",
			key: "operation",
			fixed: "right",
			render: (text, record) => (
				<>
					<span
						style={{
							cursor: "pointer",
							color: "#1890FF",
							margin: "0 5px",
						}}
						onClick={() => openEditModal(record)}
					>
						Editar <EditTwoTone style={{ margin: "0 5px" }} />
					</span>{" "}
					/{" "}
					<Popconfirm
						title="Estás segur@?"
						okText="Si"
						cancelText="No"
						onConfirm={() => deleteStand(record)}
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
					/{" "}
					<span
						style={{
							cursor: "pointer",
							color: "#52c41a",
							margin: "0 5px",
						}}
						onClick={() => showButtons(record)}
					>
						Botones
						<EyeTwoTone
							style={{ margin: "0 5px" }}
							twoToneColor="#52c41a"
						/>
					</span>
				</>
			),
		},
	];

	const openEditModal = (stand) => {
		setUpdatedStandId(stand._id);
		setUpdatedStand({
			order: stand.order,
			logoExt: stand.logoExtAux,
			logo: stand.logoAux,
			name: stand.name,
			type: "L",
			phone: stand.phone,
			email: stand.email,
			page: stand.page,
			title: stand.title,
			description: stand.description,
			header: stand.headerAux,
			banner: stand.banner,
			video: stand.video,
			image1: stand.image1,
			image2: stand.image2,
			image3: stand.image3,
			image4: stand.image4,
			image5: stand.image5,
			image6: stand.image6,
		});
		setVisible2(true);
	};

	const saveStand = async () => {
		setLoading(true);
		setConfirmLoading(true);
		if (selectedStand.name.trim().length === 0) {
			notification["error"]({
				message: "El nombre es obligatorio",
			});
			setLoading(false);
			setConfirmLoading(false);
		} else if (selectedStand.type.trim().length === 0) {
			notification["error"]({
				message: "El tipo de stand es obligatorio",
			});
			setLoading(false);
			setConfirmLoading(false);
		} else if (selectedStand.title.trim().length === 0) {
			notification["error"]({
				message: "El título es obligatorio",
			});
			setLoading(false);
			setConfirmLoading(false);
		} else if (selectedStand.description.trim().length === 0) {
			notification["error"]({
				message: "La descripción es obligatoria",
			});
			setLoading(false);
			setConfirmLoading(false);
		} else {
			const resp = await postStandApi(token, selectedStand);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				const standId = resp.standId;
				if (typeof selectedStand.logo == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.logo,
						standId,
						"LOGO"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				console.log(selectedStand)
				if (typeof selectedStand.logoExt == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.logoExt,
						standId,
						"LOGOEXT"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.header == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.header,
						standId,
						"HEADER"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image1 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image1,
						standId,
						"IMAGE1"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image2 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image2,
						standId,
						"IMAGE2"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image3 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image3,
						standId,
						"IMAGE3"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image4 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image4,
						standId,
						"IMAGE4"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image5 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image5,
						standId,
						"IMAGE5"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				if (typeof selectedStand.image6 == "object") {
					const result = await putUploadImageApi(
						token,
						selectedStand.image6,
						standId,
						"IMAGE6"
					);
					if (result.ok) {
						notification["success"]({
							message: result.message,
						});
					} else {
						notification["error"]({
							message: result.message,
						});
					}
				}
				getData();
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
				setConfirmLoading(false);
			}
		}
	};

	const editStand = async () => {
		setConfirmLoading(true);
		setConfirmLoading2(true);
		if (updatedStand.name.trim().length === 0) {
			notification["error"]({
				message: "El nombre es obligatorio",
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else if (updatedStand.type.trim().length === 0) {
			notification["error"]({
				message: "El tipo de stand es obligatorio",
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else if (updatedStand.title.trim().length === 0) {
			notification["error"]({
				message: "El título es obligatorio",
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else if (updatedStand.description.trim().length === 0) {
			notification["error"]({
				message: "La descripción es obligatoria",
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else {
			const resp = await putStandApi(token, updatedStand, updatedStandId);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				const standId = updatedStandId;
				if (logoExtUpdate !== null) {
					if (typeof logoExtUpdate.file == "object") {
						const result = await putUploadImageApi(
							token,
							logoExtUpdate.file,
							standId,
							"LOGOEXT"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (logoUpdate !== null) {
					if (typeof logoUpdate.file == "object") {
						const result = await putUploadImageApi(
							token,
							logoUpdate.file,
							standId,
							"LOGO"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (headerUpdate !== null) {
					if (typeof headerUpdate.file == "object") {
						const result = await putUploadImageApi(
							token,
							headerUpdate.file,
							standId,
							"HEADER"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image1Update !== null) {
					if (typeof image1Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image1Update.file,
							standId,
							"IMAGE1"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image2Update !== null) {
					if (typeof image2Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image2Update.file,
							standId,
							"IMAGE2"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image3Update !== null) {
					if (typeof image3Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image3Update.file,
							standId,
							"IMAGE3"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image4Update !== null) {
					if (typeof image4Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image4Update.file,
							standId,
							"IMAGE4"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image5Update !== null) {
					if (typeof image5Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image5Update.file,
							standId,
							"IMAGE5"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				if (image6Update !== null) {
					if (typeof image6Update.file == "object") {
						const result = await putUploadImageApi(
							token,
							image6Update.file,
							standId,
							"IMAGE6"
						);
						if (result.ok) {
							notification["success"]({
								message: result.message,
							});
						} else {
							notification["error"]({
								message: result.message,
							});
						}
					}
				}
				getData();
			} else {
				notification["error"]({
					message: resp.message,
				});
				setConfirmLoading(false);
				setConfirmLoading2(false);
			}
		}
	};

	const deleteStand = async (stand) => {
		setLoading(true);
		const resp = await deleteStandApi(token, stand._id);
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

	const showButtons = (stand) => {
		setStandId(stand._id);
		setStandStatus(1);
	};

	const onChangeForm = (e) => {
		setSelectedStand({
			...selectedStand,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeForm2 = (e) => {
		setUpdatedStand({
			...updatedStand,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-stand">
				{functionStatus ? (
					<div className="container-table">
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar stand
						</Button>
						<Table
							pagination={false}
							dataSource={dataSource}
							columns={columns}
							rowKey="index"
							bordered
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
						<h1 className="title">Crear Stand</h1>
						<Divider plain><Space>Nombre  <Tooltip title="Nombre con el que se registrará la analítica del stand"><QuestionCircleTwoTone /></Tooltip></Space><span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Nombre"}
							onChange={onChangeForm}
							id="name"
							name="name"
							type="text"
							value={selectedStand.name}
						/>
						<Divider plain>Título <span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Título"}
							onChange={onChangeForm}
							id="title"
							name="title"
							type="text"
							value={selectedStand.title}
						/>
						<Divider plain>Descripción <span className="obligatory">*</span></Divider>
						<TextArea
							showCount
							maxLength={200}
							id="description"
							name="description"
							onChange={onChangeForm}
							value={selectedStand.description}
						/>
						<Divider plain>Link video</Divider>
						<Input
							placeholder={"Link"}
							onChange={onChangeForm}
							id="video"
							name="video"
							type="text"
							value={selectedStand.video}
						/>
						<Divider plain>Teléfono contacto</Divider>
						<Input
							placeholder={"Teléfono contacto"}
							onChange={onChangeForm}
							id="phone"
							name="phone"
							type="text"
							value={selectedStand.phone}
						/>
						<Divider plain>Correo contacto</Divider>
						<Input
							placeholder={"Correo contacto"}
							onChange={onChangeForm}
							id="email"
							name="email"
							type="email"
							value={selectedStand.email}
						/>
						<Divider plain>Página web</Divider>
						<Input
							placeholder={"Página web"}
							onChange={onChangeForm}
							id="page"
							name="page"
							type="text"
							value={selectedStand.page}
						/>
						<Divider plain>Slider (650px X 380px)</Divider>
						<UploadImage
							image={header}
							setImage={setHeader}
							width={"650"}
							height={"380"}
						/>
						<Divider plain>Logo Exterior (200px X 70px)</Divider>
						<UploadImage
							image={logoExt}
							setImage={setLogoExt}
							width={"200"}
							height={"70"}
						/>
						<Divider plain>Logo (100px X 100px)</Divider>
						<UploadImage
							image={logo}
							setImage={setLogo}
							width={"100"}
							height={"100"}
						/>
						<Divider plain>Carrusel - Imagen 1 (270px X 170px)</Divider>
						<Input
							placeholder={"Redirección Url"}
							onChange={onChangeForm}
							id="redirect1"
							name="redirect1"
							type="text"
							value={selectedStand.redirect1}
						/>
						<UploadImage
							image={image1}
							setImage={setImage1}
							width={"270"}
							height={"170"}
						/>
						{image1 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 2 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect2"
									name="redirect2"
									type="text"
									value={selectedStand.redirect2}
								/>
								<UploadImage
									image={image2}
									setImage={setImage2}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image2 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 3 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect3"
									name="redirect3"
									type="text"
									value={selectedStand.redirect3}
								/>
								<UploadImage
									image={image3}
									setImage={setImage3}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image3 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 4 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect4"
									name="redirect4"
									type="text"
									value={selectedStand.redirect4}
								/>
								<UploadImage
									image={image4}
									setImage={setImage4}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image4 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 5 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect5"
									name="redirect5"
									type="text"
									value={selectedStand.redirect5}
								/>
								<UploadImage
									image={image5}
									setImage={setImage5}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image5 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 6 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect6"
									name="redirect6"
									type="text"
									value={selectedStand.redirect6}
								/>
								<UploadImage
									image={image6}
									setImage={setImage6}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						<Button
							type="primary"
							className="btn"
							onClick={saveStand}
						>
							Guardar
						</Button>
					</div>
				)}
				<Modal
					title="Agregar otro stand"
					visible={visible}
					onOk={saveStand}
					confirmLoading={confirmLoading}
					onCancel={() => setVisible(false)}
					width={1000}
				>
					<div className="modal-stand">
						<h3 className="title">Agregar</h3>
						<Divider plain><Space>Nombre  <Tooltip title="Nombre con el que se registrará la analítica del stand"><QuestionCircleTwoTone /></Tooltip></Space><span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Nombre"}
							onChange={onChangeForm}
							id="name"
							name="name"
							type="text"
							value={selectedStand.name}
						/>
						{/* <Divider plain>Tipo</Divider>
						<Select value={selectedStand.type} onChange={handleChange}>
							<Option value="XL">XL</Option>
							<Option value="L">L</Option>
							<Option value="M">M</Option>
							<Option value="S">S</Option>
						</Select> */}
						<Divider plain>Título <span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Título"}
							onChange={onChangeForm}
							id="title"
							name="title"
							type="text"
							value={selectedStand.title}
						/>
						<Divider plain>Descripción <span className="obligatory">*</span></Divider>
						<TextArea
							showCount
							maxLength={200}
							id="description"
							name="description"
							onChange={onChangeForm}
							value={selectedStand.description}
						/>
						<Divider plain>Link video</Divider>
						<Input
							placeholder={"Link"}
							onChange={onChangeForm}
							id="video"
							name="video"
							type="text"
							value={selectedStand.video}
						/>
						<Divider plain>Teléfono contacto</Divider>
						<Input
							placeholder={"Teléfono contacto"}
							onChange={onChangeForm}
							id="phone"
							name="phone"
							type="text"
							value={selectedStand.phone}
						/>
						<Divider plain>Correo contacto</Divider>
						<Input
							placeholder={"Correo contacto"}
							onChange={onChangeForm}
							id="email"
							name="email"
							type="email"
							value={selectedStand.email}
						/>
						<Divider plain>Página web</Divider>
						<Input
							placeholder={"Página web"}
							onChange={onChangeForm}
							id="page"
							name="page"
							type="text"
							value={selectedStand.page}
						/>
						<Divider plain>Slider (650px X 380px)</Divider>
						<UploadImage
							image={header}
							setImage={setHeader}
							width={"650"}
							height={"380"}
						/>
						<Divider plain>Logo Exterior (200px X 70px)</Divider>
							<UploadImage
								image={logoExt}
								setImage={setLogoExt}
								width={"200"}
								height={"70"}
							/>
						<Divider plain>Logo (100px X 100px)</Divider>
						<UploadImage
							image={logo}
							setImage={setLogo}
							width={"100"}
							height={"100"}
						/>
						<Divider plain>Carrusel - Imagen 1 (270px X 170px)</Divider>
						<Input
							placeholder={"Redirección Url"}
							onChange={onChangeForm}
							id="redirect1"
							name="redirect1"
							type="text"
							value={selectedStand.redirect1}
						/>
						<UploadImage
							image={image1}
							setImage={setImage1}
							width={"270"}
							height={"170"}
						/>
						{image1 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 2 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect2"
									name="redirect2"
									type="text"
									value={selectedStand.redirect2}
								/>
								<UploadImage
									image={image2}
									setImage={setImage2}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image2 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 3 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect3"
									name="redirect3"
									type="text"
									value={selectedStand.redirect3}
								/>
								<UploadImage
									image={image3}
									setImage={setImage3}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image3 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 4 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect4"
									name="redirect4"
									type="text"
									value={selectedStand.redirect4}
								/>
								<UploadImage
									image={image4}
									setImage={setImage4}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image4 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 5 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect5"
									name="redirect5"
									type="text"
									value={selectedStand.redirect5}
								/>
								<UploadImage
									image={image5}
									setImage={setImage5}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
						{image5 !== null ? (
							<>
								<Divider plain>Carrusel - Imagen 6 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm}
									id="redirect6"
									name="redirect6"
									type="text"
									value={selectedStand.redirect6}
								/>
								<UploadImage
									image={image6}
									setImage={setImage6}
									width={"270"}
									height={"170"}
								/>
							</>
						) : null}
					</div>
				</Modal>
				<Modal
					title="Editar Stand"
					visible={visible2}
					onOk={editStand}
					confirmLoading={confirmLoading2}
					onCancel={() => setVisible2(false)}
					width={1000}
				>
					<div className="modal-stand">
						<h3 className="title">Editar Stand</h3>
						<Divider plain><Space>Nombre  <Tooltip title="Nombre con el que se registrará la analítica del stand"><QuestionCircleTwoTone /></Tooltip></Space><span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Nombre"}
							onChange={onChangeForm2}
							id="name"
							name="name"
							type="text"
							value={updatedStand.name}
						/>
						<Divider plain>Título <span className="obligatory">*</span></Divider>
						<Input
							placeholder={"Título"}
							onChange={onChangeForm2}
							id="title"
							name="title"
							type="text"
							value={updatedStand.title}
						/>
						<Divider plain>Descripción <span className="obligatory">*</span></Divider>
						<TextArea
							showCount
							maxLength={200}
							id="description"
							name="description"
							onChange={onChangeForm2}
							value={updatedStand.description}
						/>
						<Divider plain>Link video</Divider>
						<Input
							placeholder={"Link"}
							onChange={onChangeForm2}
							id="video"
							name="video"
							type="text"
							value={updatedStand.video}
						/>
						<Divider plain>Teléfono contacto</Divider>
						<Input
							placeholder={"Teléfono contacto"}
							onChange={onChangeForm2}
							id="phone"
							name="phone"
							type="text"
							value={updatedStand.phone}
						/>
						<Divider plain>Correo contacto</Divider>
						<Input
							placeholder={"Correo contacto"}
							onChange={onChangeForm2}
							id="email"
							name="email"
							type="email"
							value={updatedStand.email}
						/>
						<Divider plain>Página web</Divider>
						<Input
							placeholder={"Página web"}
							onChange={onChangeForm2}
							id="page"
							name="page"
							type="text"
							value={updatedStand.page}
						/>
						<Divider plain>Slider (650px X 380px)</Divider>
						<UploadImage2
							image={headerUpdate}
							setImage={setHeaderUpdate}
							width={"650"}
							height={"380"}
							url={`${basePath}/${apiVersion}/stand-image/${updatedStand.header}`}
						/>
						<Divider plain>Logo Exterior (200px X 70px)</Divider>
							<UploadImage
								image={logoExtUpdate}
								setImage={setLogoExtUpdate}
								width={"200"}
								height={"70"}
							/>
						<Divider plain>Logo (100px X 100px)</Divider>
						<UploadImage2
							image={logoUpdate}
							setImage={setLogoUpdate}
							width={"100"}
							height={"100"}
							url={`${basePath}/${apiVersion}/stand-image/${updatedStand.logo}`}
						/>
						<Divider plain>Carrusel - Imagen 1 (270px X 170px)</Divider>
						<Input
							placeholder={"Redirección Url"}
							onChange={onChangeForm2}
							id="redirect1"
							name="redirect1"
							type="text"
							value={updatedStand.redirect1}
						/>
						<UploadImage2
							image={image1Update}
							setImage={setImage1Update}
							width={"270"}
							height={"170"}
							url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image1}`}
						/>
						{image1Update !== null || updatedStand.image1.length > 0 ? (
							<>
								<Divider plain>Carrusel - Imagen 2 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm2}
									id="redirect2"
									name="redirect2"
									type="text"
									value={updatedStand.redirect2}
								/>
								<UploadImage2
									image={image2Update}
									setImage={setImage2Update}
									width={"270"}
									height={"170"}
									url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image2}`}
								/>
							</>
						) : null}
						{image2Update !== null || updatedStand.image2.length > 0 ? (
							<>
								<Divider plain>Carrusel - Imagen 3 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm2}
									id="redirect3"
									name="redirect3"
									type="text"
									value={updatedStand.redirect3}
								/>
								<UploadImage2
									image={image3Update}
									setImage={setImage3Update}
									width={"270"}
									height={"170"}
									url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image3}`}
								/>
							</>
						) : null}
						{image3Update !== null || updatedStand.image3.length > 0 ? (
							<>
								<Divider plain>Carrusel - Imagen 4 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm2}
									id="redirect4"
									name="redirect4"
									type="text"
									value={updatedStand.redirect4}
								/>
								<UploadImage2
									image={image4Update}
									setImage={setImage4Update}
									width={"270"}
									height={"170"}
									url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image4}`}
								/>
							</>
						) : null}
						{image4Update !== null || updatedStand.image4.length > 0 ? (
							<>
								<Divider plain>Carrusel - Imagen 5 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm2}
									id="redirect5"
									name="redirect5"
									type="text"
									value={updatedStand.redirect5}
								/>
								<UploadImage2
									image={image5Update}
									setImage={setImage5Update}
									width={"270"}
									height={"170"}
									url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image5}`}
								/>
							</>
						) : null}
						{image5Update !== null || updatedStand.image5.length > 0 ? (
							<>
								<Divider plain>Carrusel - Imagen 6 (270px X 170px)</Divider>
								<Input
									placeholder={"Redirección Url"}
									onChange={onChangeForm2}
									id="redirect6"
									name="redirect6"
									type="text"
									value={updatedStand.redirect6}
								/>
								<UploadImage2
									image={image6Update}
									setImage={setImage6Update}
									width={"270"}
									height={"170"}
									url={`${basePath}/${apiVersion}/stand-image/${updatedStand.image6}`}
								/>
							</>
						) : null}
					</div>
				</Modal>
			</div>
		</Spin>
	);
};

export default Stand;

function UploadImage(props) {
	const { image, setImage, width, height } = props;
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (image) {
			if (image.preview) {
				setImageUrl(image.preview);
			} else {
				setImageUrl(image);
			}
		} else {
			setImageUrl(null);
		}
	}, [image]);

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			setImage({ file, preview: URL.createObjectURL(file) });
		},
		[setImage]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: "image/jpeg, image/png",
		noKeyboard: true,
		onDrop,
	});

	return (
		<div className="upload-avatar" {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<Avatar
					style={{
						width: "100%",
						maxWidth: `${width}px`,
						minHeight: `${height}px`,
					}}
					src={`http://placehold.it/${width}x${height}`}
				/>
			) : (
				<Avatar
					style={{
						width: "100%",
						maxWidth: `${width}px`,
						minHeight: `${height}px`,
					}}
					src={
						imageUrl
							? imageUrl
							: `http://placehold.it/${width}x${height}`
					}
				/>
			)}
		</div>
	);
}

function UploadImage2(props) {
	const { image, setImage, width, height, url } = props;
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (image) {
			if (image.preview) {
				setImageUrl(image.preview);
			} else {
				setImageUrl(image);
			}
		} else {
			setImageUrl(null);
		}
	}, [image]);

	const onDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			setImage({ file, preview: URL.createObjectURL(file) });
		},
		[setImage]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: "image/jpeg, image/png",
		noKeyboard: true,
		onDrop,
	});

	return (
		<div className="upload-avatar" {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<Avatar
					style={{
						width: "100%",
						maxWidth: `${width}px`,
						minHeight: `${height}px`,
					}}
					src={url}
				/>
			) : (
				<Avatar
					style={{
						width: "100%",
						maxWidth: `${width}px`,
						minHeight: `${height}px`,
					}}
					src={imageUrl ? imageUrl : url}
				/>
			)}
		</div>
	);
}
