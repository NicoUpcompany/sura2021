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
	Divider,
	Avatar,
	Select,
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	ArrowLeftOutlined,
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
	getExpositorApi,
	postExpositorApi,
	putExpositorApi,
	deleteExpositorApi,
	putUploadImageApi,
    getExpositorImageApi
} from "../../../../api/Admin/expositor";
import { basePath, apiVersion } from "../../../../api/config";

import NoAvatar from "../../../../assets/img/no-avatar.png";

import "./Expositor.scss";

const { Option } = Select;

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Expositor = (props) => {
	const { token, setAgendaStatus, talkId } = props;

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [image, setImage] = useState(null);
	const [updateImage, setUpdateImage] = useState(null);
	const [updatedId, setUpdatedId] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({
		title: "speaker",
		name: "",
		image: "",
		position: "",
		enterprise: "",
		talk: talkId,
	});
	const [updatedOptions, setUpdatedOptions] = useState({
		title: "",
		name: "",
		image: "",
		position: "",
		enterprise: "",
		talk: talkId,
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	useEffect(() => {
		if (image) {
			setSelectedOptions({
				...selectedOptions,
				image: image.file,
			});
		}
	}, [image]);

	useEffect(() => {
		if (updateImage) {
			setUpdatedOptions({
				...updatedOptions,
				image: updateImage.file,
			});
		}
	}, [updateImage]);

	const getData = async () => {
		const resp = await getExpositorApi(token, talkId);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.expositor.forEach((item) => {
				const element = {
					...item,
					index: cont,
					avatar: (
						<Avatar
							size={100}
							style={{
								position: "relative",
								display: "block",
								margin: "auto",
							}}
							src={`${basePath}/${apiVersion}/expositor-image/${item.image}`}
						/>
					),
					key: item._id,
				};
				array.push(element);
				cont = cont + 1;
			});
			setFunctionStatus(true);
			setDataSource(array);
			setLoading(false);
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
				putExpositorApi(token, item, item._id);
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
			title: "Imagen",
			dataIndex: "avatar",
			className: "drag-visible",
		},
		{
			title: "ID",
			dataIndex: "_id",
			width: 100,
			className: "drag-visible",
			...getColumnSearchProps("_id"),
		},
		{
			title: "Título",
			dataIndex: "title",
			className: "drag-visible",
			...getColumnSearchProps("title"),
		},
		{
			title: "Nombre",
			dataIndex: "name",
			className: "drag-visible",
			...getColumnSearchProps("name"),
		},
		{
			title: "Cargo",
			dataIndex: "position",
			className: "drag-visible",
			...getColumnSearchProps("position"),
		},
		{
			title: "Empresa",
			dataIndex: "enterprise",
			className: "drag-visible",
			...getColumnSearchProps("enterprise"),
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
						onConfirm={() => deleteExpositor(record)}
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

	const onChangeForm = (e) => {
		setSelectedOptions({
			...selectedOptions,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeForm2 = (e) => {
		setUpdatedOptions({
			...updatedOptions,
			[e.target.name]: e.target.value,
		});
	};

	const handleChange = (value) => {
		setSelectedOptions({
			...selectedOptions,
			title: value,
		});
	};

	const handleChange2 = (value) => {
		setUpdatedOptions({
			...updatedOptions,
			title: value,
		});
	};

	const openEditModal = (expositor) => {
		setUpdatedId(expositor._id);
		setUpdatedOptions({
			title: expositor.title,
			name: expositor.name,
			position: expositor.position,
			enterprise: expositor.enterprise,
		});
		if (expositor.image.length > 0) {
            setUpdateImage(expositor.image.length);
		}
		setVisible2(true);
	};

	const saveExpositor = async () => {
		if (
			selectedOptions.title.trim().length === 0 ||
			selectedOptions.name.trim().length === 0 ||
			selectedOptions.position.trim().length === 0 ||
			selectedOptions.enterprise.trim().length === 0
		) {
			notification["error"]({
				message: "Todos los campos son obligatorios",
			});
		} else {
			setLoading(true);
			setConfirmLoading(true);
			const resp = await postExpositorApi(token, selectedOptions);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				const expositorId = resp.expositorId;
				if (typeof selectedOptions.image == "object") {
					const result = await putUploadImageApi(
						token,
						selectedOptions.image,
						expositorId
					);
					if (result.ok) {
						getData();
						setSelectedOptions({
							...selectedOptions,
							title: "",
							name: "",
							image: "",
							position: "",
							enterprise: "",
						});
						setConfirmLoading(false);
						setVisible(false);
					} else {
						notification["error"]({
							message: result.message,
						});
						setLoading(false);
						setConfirmLoading(false);
					}
				} else {
					getData();
					setConfirmLoading(false);
					setVisible(false);
				}
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
				setConfirmLoading(false);
			}
		}
	};

	const editExpositor = async () => {
		if (
			updatedOptions.title.trim().length === 0 ||
			updatedOptions.name.trim().length === 0 ||
			updatedOptions.position.trim().length === 0 ||
			updatedOptions.enterprise.trim().length === 0
		) {
			notification["error"]({
				message: "Todos los campos son obligatorios",
			});
		} else {
			setLoading(true);
			setConfirmLoading2(true);
			const expositorId = updatedId;
            const data = {
                title: updatedOptions.title,
                name: updatedOptions.name,
                position: updatedOptions.position,
                enterprise: updatedOptions.enterprise,
            }
			const resp = await putExpositorApi(
				token,
				data,
				expositorId
			);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				if (typeof updatedOptions.image == "object") {
					const result = await putUploadImageApi(
						token,
						updatedOptions.image,
						expositorId
					);
					if (result.ok) {
						getData();
						setUpdatedOptions({
							...updatedOptions,
							title: "",
							name: "",
							image: "",
							position: "",
							enterprise: "",
						});
						setConfirmLoading2(false);
						setVisible2(false);
					} else {
						notification["error"]({
							message: result.message,
						});
						setLoading(false);
						setConfirmLoading2(false);
					}
				} else {
					getData();
					setConfirmLoading2(false);
					setVisible2(false);
				}
			} else {
				notification["error"]({
					message: resp.message,
				});
				setLoading(false);
				setConfirmLoading2(false);
			}
		}
	};

	const deleteExpositor = async (expositor) => {
		setLoading(true);
		const resp = await deleteExpositorApi(token, expositor._id);
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

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-expositor">
				{functionStatus ? (
					<div className="container-table">
						<Button
							type="primary"
							className="arrow"
							onClick={() => setAgendaStatus(1)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otro expositor
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
							onClick={() => setAgendaStatus(1)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<h1 className="title">Crear Expositor</h1>
						<UploadImage image={image} setImage={setImage} />
						<Divider orientation="center" plain>
							Título
						</Divider>
						<Select
							value={selectedOptions.title}
							onChange={handleChange}
						>
							<Option value="moderador">Moderador</Option>
							<Option value="speaker">Speaker</Option>
						</Select>
						<Divider orientation="center" plain>
							Nombre
						</Divider>
						<Input
							placeholder={`Nombre ${selectedOptions.title}`}
							onChange={onChangeForm}
							id="name"
							name="name"
							value={selectedOptions.name}
						/>
						<Divider orientation="center" plain>
							Cargo
						</Divider>
						<Input
							placeholder={`Cargo ${selectedOptions.title}`}
							onChange={onChangeForm}
							id="position"
							name="position"
							value={selectedOptions.position}
						/>
						<Divider orientation="center" plain>
							Empresa
						</Divider>
						<Input
							placeholder={`Empresa ${selectedOptions.title}`}
							onChange={onChangeForm}
							id="enterprise"
							name="enterprise"
							value={selectedOptions.enterprise}
						/>
						<Button
							type="primary"
							className="btn"
							onClick={saveExpositor}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otro expositor"
				visible={visible}
				onOk={saveExpositor}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
			>
				<div className="modal-container">
					<h3 className="title">Agregar</h3>
					<UploadImage image={image} setImage={setImage} />
					<Divider orientation="center" plain>
						Título
					</Divider>
					<Select
						value={selectedOptions.title}
						onChange={handleChange}
					>
						<Option value="moderador">Moderador</Option>
						<Option value="speaker">Speaker</Option>
					</Select>
					<Divider orientation="center" plain>
						Nombre
					</Divider>
					<Input
						placeholder={`Nombre ${selectedOptions.title}`}
						onChange={onChangeForm}
						id="name"
						name="name"
						value={selectedOptions.name}
					/>
					<Divider orientation="center" plain>
						Cargo
					</Divider>
					<Input
						placeholder={`Cargo ${selectedOptions.title}`}
						onChange={onChangeForm}
						id="position"
						name="position"
						value={selectedOptions.position}
					/>
					<Divider orientation="center" plain>
						Empresa
					</Divider>
					<Input
						placeholder={`Empresa ${selectedOptions.title}`}
						onChange={onChangeForm}
						id="enterprise"
						name="enterprise"
						value={selectedOptions.enterprise}
					/>
				</div>
			</Modal>
			<Modal
				title="Editar expositor"
				visible={visible2}
				onOk={editExpositor}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<div className="modal-container">
					<h3 className="title">Editar</h3>
					<UploadImage
						image={updateImage}
						setImage={setUpdateImage}
					/>
					<Divider orientation="center" plain>
						Título
					</Divider>
					<Select
						value={updatedOptions.title}
						onChange={handleChange2}
					>
						<Option value="moderador">Moderador</Option>
						<Option value="speaker">Speaker</Option>
					</Select>
					<Divider orientation="center" plain>
						Nombre
					</Divider>
					<Input
						placeholder={`Nombre ${updatedOptions.title}`}
						onChange={onChangeForm2}
						id="name"
						name="name"
						value={updatedOptions.name}
					/>
					<Divider orientation="center" plain>
						Cargo
					</Divider>
					<Input
						placeholder={`Cargo ${updatedOptions.title}`}
						onChange={onChangeForm2}
						id="position"
						name="position"
						value={updatedOptions.position}
					/>
					<Divider orientation="center" plain>
						Empresa
					</Divider>
					<Input
						placeholder={`Empresa ${updatedOptions.title}`}
						onChange={onChangeForm2}
						id="enterprise"
						name="enterprise"
						value={updatedOptions.enterprise}
					/>
				</div>
			</Modal>
		</Spin>
	);
};

export default Expositor;

function UploadImage(props) {
	const { image, setImage } = props;
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
				<Avatar size={100} src={NoAvatar} />
			) : (
				<Avatar size={100} src={imageUrl ? imageUrl : NoAvatar} />
			)}
		</div>
	);
}
