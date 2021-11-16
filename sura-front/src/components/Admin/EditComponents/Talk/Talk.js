/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	Spin,
	Table,
	Input,
	Space,
	Button,
	TimePicker,
	notification,
	Modal,
	Popconfirm,
	Divider,
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	EyeTwoTone,
	ArrowLeftOutlined,
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
	getTalkApi,
	postTalkApi,
	putTalkApi,
	deleteTalkApi,
} from "../../../../api/Admin/talk";

import "./Talk.scss";

const { TextArea } = Input;

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Talk = (props) => {
	const { token, setAgendaStatus, agendaId, setTalkId } = props;

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [visible3, setVisible3] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [confirmLoading3, setConfirmLoading3] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [updatedDateId, setUpdatedDateId] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({
		hourStart: "",
		minuteStart: "",
		hourEnd: "",
		minuteEnd: "",
		title: "",
		breakVar: false,
		agenda: agendaId,
	});
	const [updatedOptions, setUpdatedOptions] = useState({
		hourStart: "",
		minuteStart: "",
		hourEnd: "",
		minuteEnd: "",
		title: "",
		breakVar: false,
		agenda: agendaId,
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getTalkApi(token, agendaId);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.talk.forEach((item) => {
				const element = {
					...item,
					hourMinute: `${item.hourStart}:${item.minuteStart}`,
					hourMinuteEnd: `${item.hourEnd}:${item.minuteEnd}`,
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
				putTalkApi(token, item, item._id);
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
			title: "Título",
			dataIndex: "title",
			className: "drag-visible",
			...getColumnSearchProps("title"),
		},
		{
			title: "Comienzo",
			dataIndex: "hourMinute",
			className: "drag-visible",
			...getColumnSearchProps("hourMinute"),
		},
		{
			title: "Término",
			dataIndex: "hourMinuteEnd",
			className: "drag-visible",
			...getColumnSearchProps("hourMinuteEnd"),
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
						onConfirm={() => deleteTalk(record)}
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
					{record.break ? null : (
						<>
							/{" "}
							<span
								style={{
									cursor: "pointer",
									color: "#52c41a",
									margin: "0 5px",
								}}
								onClick={() => showExpositor(record)}
							>
								Expositores
								<EyeTwoTone
									style={{ margin: "0 5px" }}
									twoToneColor="#52c41a"
								/>
							</span>
						</>
					)}
				</>
			),
		},
	];

	const onCreateTalk = (time, timeString) => {
		const hour = moment(time).format("HH");
		const minute = moment(time).format("mm");
		setSelectedOptions({
			...selectedOptions,
			hourStart: hour,
			minuteStart: minute,
		});
	};

	const onCreateTalkEnd = (time, timeString) => {
		const hourEnd = moment(time).format("HH");
		const minuteEnd = moment(time).format("mm");
		setSelectedOptions({
			...selectedOptions,
			hourEnd: hourEnd,
			minuteEnd: minuteEnd,
		});
	};

	const onChangeTitle = (e) => {
		setSelectedOptions({
			...selectedOptions,
			title: e.target.value,
		});
	};

	const onChangeTitle2 = (e) => {
		setUpdatedOptions({
			...updatedOptions,
			title: e.target.value,
		});
	};

	const onCreateTalk2 = (time, timeString) => {
		const hour = moment(time).format("HH");
		const minute = moment(time).format("mm");
		setUpdatedOptions({
			...updatedOptions,
			hourStart: hour,
			minuteStart: minute,
			hourMinute: `${hour}:${minute}`,
		});
	};

	const onCreateTalkEnd2 = (time, timeString) => {
		const hourEnd = moment(time).format("HH");
		const minuteEnd = moment(time).format("mm");
		setUpdatedOptions({
			...updatedOptions,
			hourEnd: hourEnd,
			minuteEnd: minuteEnd,
			hourMinuteEnd: `${hourEnd}:${minuteEnd}`,
		});
	};

	const openEditModal = (talk) => {
		setUpdatedDateId(talk._id);
		setUpdatedOptions({
			title: talk.title,
			hourStart: talk.hourStart,
			minuteStart: talk.minuteStart,
			hourEnd: talk.hourEnd,
			minuteEnd: talk.minuteEnd,
		});
		setVisible2(true);
	};

	const saveTalk = async () => {
		setLoading(true);
		setConfirmLoading(true);
		setConfirmLoading3(true);
		if (visible3) {
			if (
				selectedOptions.hourStart === 0 ||
				selectedOptions.hourEnd === 0
			) {
				notification["error"]({
					message: "Todos los campos son obligatorio",
				});
				setLoading(false);
			} else {
				let sendData = selectedOptions;
				sendData = {
					...sendData,
					title: "Break",
					breakVar: true,
				};
				const resp = await postTalkApi(token, sendData);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					getData();
					setVisible3(false);
					setConfirmLoading3(false);
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
					setConfirmLoading3(false);
				}
			}
		} else {
			if (
				selectedOptions.hourStart === 0 ||
				selectedOptions.hourEnd === 0 ||
				selectedOptions.title.length === 0
			) {
				notification["error"]({
					message: "Todos los campos son obligatorio",
				});
				setLoading(false);
			} else {
				const resp = await postTalkApi(token, selectedOptions);
				if (resp.ok) {
					notification["success"]({
						message: resp.message,
					});
					getData();
					setVisible(false);
					setConfirmLoading(false);
				} else {
					notification["error"]({
						message: resp.message,
					});
					setLoading(false);
					setConfirmLoading(false);
				}
			}
		}
	};

	const editTalk = async () => {
		setConfirmLoading(true);
		setConfirmLoading2(true);
		if (
			updatedOptions.hourStart === 0 ||
			updatedOptions.hourEnd === 0 ||
			updatedOptions.title.length === 0
		) {
			notification["error"]({
				message: "Todos los campos son obligatorio",
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		} else {
			const resp = await putTalkApi(token, updatedOptions, updatedDateId);
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
		}
	};

	const deleteTalk = async (talk) => {
		setLoading(true);
		const resp = await deleteTalkApi(token, talk._id);
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

	const showExpositor = (talk) => {
		setTalkId(talk._id);
		setAgendaStatus(2);
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-talk">
				{functionStatus ? (
					<div className="container-table">
						<Button
							type="primary"
							className="arrow"
							onClick={() => setAgendaStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<Button
							type="danger"
							className="btn"
							style={{ marginRight: "200px" }}
							onClick={() => setVisible3(true)}
						>
							Agregar Break
						</Button>
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otra charla
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
							onClick={() => setAgendaStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<h1 className="title">Crear Charla</h1>
						<Divider orientation="center" plain>
							Título
						</Divider>
						<TextArea
							showCount
							maxLength={100}
							onChange={onChangeTitle}
						/>
						<Divider orientation="center" plain>
							Comienzo
						</Divider>
						<TimePicker onChange={onCreateTalk} format={"HH:mm"} />
						<Divider orientation="center" plain>
							Término
						</Divider>
						<TimePicker
							onChange={onCreateTalkEnd}
							format={"HH:mm"}
						/>
						<Button
							type="primary"
							className="btn"
							onClick={saveTalk}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otra charla"
				visible={visible}
				onOk={saveTalk}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
			>
				<h3 className="title">Agregar</h3>
				<Divider orientation="center" plain>
					Título
				</Divider>
				<TextArea showCount maxLength={100} onChange={onChangeTitle} />
				<Divider orientation="center" plain>
					Comienzo
				</Divider>
				<TimePicker format={"HH:mm"} onChange={onCreateTalk} />
				<Divider orientation="center" plain>
					Término
				</Divider>
				<TimePicker format={"HH:mm"} onChange={onCreateTalkEnd} />
			</Modal>
			<Modal
				title="Editar Charla"
				visible={visible2}
				onOk={editTalk}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<h3 className="title">Editar charla</h3>
				<Divider orientation="center" plain>
					Título
				</Divider>
				<TextArea
					value={updatedOptions.title}
					showCount
					maxLength={100}
					onChange={onChangeTitle2}
				/>
				<Divider orientation="center" plain>
					Comienzo
				</Divider>
				<TimePicker
					value={moment(
						`${updatedOptions.hourStart}:${updatedOptions.minuteStart}`,
						"HH:mm"
					)}
					format={"HH:mm"}
					onChange={onCreateTalk2}
				/>
				<Divider orientation="center" plain>
					Término
				</Divider>
				<TimePicker
					value={moment(
						`${updatedOptions.hourEnd}:${updatedOptions.minuteEnd}`,
						"HH:mm"
					)}
					format={"HH:mm"}
					onChange={onCreateTalkEnd2}
				/>
			</Modal>
			<Modal
				title="Agregar Break"
				visible={visible3}
				onOk={saveTalk}
				confirmLoading={confirmLoading3}
				onCancel={() => setVisible3(false)}
			>
				<h3 className="title">Break</h3>
				<Divider orientation="center" plain>
					Comienzo
				</Divider>
				<TimePicker format={"HH:mm"} onChange={onCreateTalk} />
				<Divider orientation="center" plain>
					Término
				</Divider>
				<TimePicker format={"HH:mm"} onChange={onCreateTalkEnd} />
			</Modal>
		</Spin>
	);
};

export default Talk;
