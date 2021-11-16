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
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	EyeTwoTone,
} from "@ant-design/icons";
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
	getAgendaApi,
	postAgendaApi,
	putAgendaApi,
	deleteAgendaApi,
} from "../../../../api/Admin/agenda";

import "./Agenda.scss";

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Agenda = (props) => {
	const { token, setAgendaStatus, setAgendaId } = props;

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [selectedDate, setSelectedDate] = useState({});
	const [updatedDate, setUpdatedDate] = useState({});
	const [updatedDateId, setUpdatedDateId] = useState("");

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getAgendaApi(token);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.agenda.forEach((item) => {
				const element = {
					...item,
					index: cont,
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
				putAgendaApi(token, item, item._id);
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
			title: "Día",
			dataIndex: "day",
			width: "30%",
			className: "drag-visible",
			...getColumnSearchProps("day"),
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
						onConfirm={() => deleteAgenda(record)}
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
						onClick={() => showTalk(record)}
					>
						Charlas
						<EyeTwoTone
							style={{ margin: "0 5px" }}
							twoToneColor="#52c41a"
						/>
					</span>
				</>
			),
		},
	];

	const onChangeDate = (date, dateString) => {
		const newData = {
			day: moment(date).format("D"),
			month: moment(date).format("M"),
			year: moment(date).format("YYYY"),
		};
		setSelectedDate(newData);
	};

	const onUpdateDate = (date, dateString) => {
		const newData = {
			day: moment(date).format("D"),
			month: moment(date).format("M"),
			year: moment(date).format("YYYY"),
		};
		setUpdatedDate(newData);
	};

	const openEditModal = (date) => {
		const newDate = new Date(date.year, date.month - 1, date.day);
		setUpdatedDateId(date._id);
		setUpdatedDate(moment(newDate).format());
		setVisible2(true);
	};

	const saveAgenda = async () => {
		setLoading(true);
		setConfirmLoading(true);
		if (selectedDate.year > 0) {
			const data = {
				order: 0,
				year: selectedDate.year,
				month: selectedDate.month - 1,
				day: selectedDate.day,
			};
			const resp = await postAgendaApi(token, data);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				setVisible(false);
				setConfirmLoading(false);
				getData();
			} else {
				notification["error"]({
					message: resp.message,
				});
				setConfirmLoading(false);
				setLoading(false);
			}
		} else {
			notification["error"]({
				message: "Ingrese una fecha válida",
			});
			setConfirmLoading(false);
			setLoading(false);
		}
	};

	const editAgenda = async () => {
		setConfirmLoading(true);
		setConfirmLoading2(true);
		const resp = await putAgendaApi(token, updatedDate, updatedDateId);
		if (resp.ok) {
			notification["success"]({
				message: resp.message,
			});
			getData();
			setVisible2(false);
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else {
			notification["error"]({
				message: resp.message,
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		}
	};

	const deleteAgenda = async (agenda) => {
		setLoading(true);
		const resp = await deleteAgendaApi(token, agenda._id);
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

	const showTalk = (agenda) => {
        setAgendaId(agenda._id);
        setAgendaStatus(1);
    };

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-agenda">
				{functionStatus ? (
					<div className="container-table">
						{/* <ArrowLeftOutlined /> */}
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otro día
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
						<h1 className="title">Crear agenda</h1>
						<DatePicker onChange={onChangeDate} />
						<Button
							type="primary"
							className="btn"
							onClick={saveAgenda}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otro día"
				visible={visible}
				onOk={saveAgenda}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
			>
				<h3 className="title">Agregar</h3>
				<DatePicker onChange={onChangeDate} />
			</Modal>
			<Modal
				title="Editar agenda"
				visible={visible2}
				onOk={editAgenda}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<h3 className="title">Editar agenda</h3>
				<DatePicker onChange={onUpdateDate} />
			</Modal>
		</Spin>
	);
};

export default Agenda;
