/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	Spin,
	Table,
	Input,
	Space,
	Button,
	Row,
	Col,
	notification,
	Modal,
	Popconfirm,
	Select,
	DatePicker,
} from "antd";
import {
	MenuOutlined,
	SearchOutlined,
	EditTwoTone,
	DeleteTwoTone,
	EyeTwoTone,
	CheckCircleTwoTone,
	CloseCircleTwoTone,
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
	postPollApi,
	getQuestionApi,
	putQuestionApi,
	deleteQuestionApi,
} from "../../../../api/Admin/poll";

import "./Poll.scss";

let searchInput = "";

const { Option } = Select;
const { RangePicker } = DatePicker;

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const Poll = (props) => {
	const { token, setPollStatus, setPollId } = props;

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [confirmLoading2, setConfirmLoading2] = useState(false);
	const [functionStatus, setFunctionStatus] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [dataSource, setDataSource] = useState([]);
	const [updateOptionId, setUpdateOptionId] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({
		order: "0",
		question: "",
		timeStartYear: "",
		timeStartMonth: "",
		timeStartDay: "",
		timeStartHour: "",
		timeStartMinute: "",
		timeStartSecond: "",
		timeEndYear: "",
		timeEndMonth: "",
		timeEndDay: "",
		timeEndHour: "",
		timeEndMinute: "",
		timeEndSecond: "",
		method: "Manual",
		active: false,
	});
	const [updatedOptions, setUpdatedOptions] = useState({
		order: "0",
		question: "",
		timeStartYear: "",
		timeStartMonth: "",
		timeStartDay: "",
		timeStartHour: "",
		timeStartMinute: "",
		timeStartSecond: "",
		timeEndYear: "",
		timeEndMonth: "",
		timeEndDay: "",
		timeEndHour: "",
		timeEndMinute: "",
		timeEndSecond: "",
		method: "Manual",
		active: false,
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getQuestionApi(token);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.poll.forEach((item) => {
				let methodAux;
				if (item.method === "Automatic") {
					methodAux = "Automatico";
				} else {
					methodAux = "Manual";
				}
				const element = {
					...item,
					index: cont,
					methodAux,
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
				putQuestionApi(token, item, item._id);
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
			title: "Pregunta / Encuesta",
			dataIndex: "question",
			className: "drag-visible",
			...getColumnSearchProps("question"),
		},
		{
			title: "Tipo",
			dataIndex: "methodAux",
			className: "drag-visible",
			filters: [
				{
					text: "Automatico",
					value: "Automatic",
				},
				{
					text: "Manual",
					value: "Manual",
				},
			],
			onFilter: (value, record) => record.method.indexOf(value) === 0,
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
						onConfirm={() => deletePoll(record)}
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
						onClick={() => showOptions(record)}
					>
						Alternativas
						<EyeTwoTone
							style={{ margin: "0 5px" }}
							twoToneColor="#52c41a"
						/>
					</span>
					{record.method === "Manual" ? (
						<>
							{record.active ? (
								<>
									/{" "}
									<span
										style={{
											cursor: "pointer",
											color: "#ffcc00",
											margin: "0 5px",
										}}
										onClick={() => activeQuestion(record)}
									>
										Ocultar
										<CloseCircleTwoTone
											style={{ margin: "0 5px" }}
											twoToneColor="#ffcc00"
										/>
									</span>
								</>
							) : (
								<>
									/{" "}
									<span
										style={{
											cursor: "pointer",
											color: "#ffcc00",
											margin: "0 5px",
										}}
										onClick={() => activeQuestion(record)}
									>
										Mostrar
										<CheckCircleTwoTone
											style={{ margin: "0 5px" }}
											twoToneColor="#ffcc00"
										/>
									</span>
								</>
							)}
						</>
					) : null}
				</>
			),
		},
	];

	const activeQuestion = async (poll) => {
		setLoading(true);
		let pollAux = poll;
		pollAux.active = !pollAux.active;
		const resp = await putQuestionApi(token, pollAux, pollAux._id);
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

	const openEditModal = (poll) => {
		setVisible2(true);
		setUpdateOptionId(poll._id);
		setUpdatedOptions({
			order: poll.order,
			question: poll.question,
			timeStartYear: poll.timeStartYear,
			timeStartMonth: poll.timeStartMonth,
			timeStartDay: poll.timeStartDay,
			timeStartHour: poll.timeStartHour,
			timeStartMinute: poll.timeStartMinute,
			timeStartSecond: poll.timeStartSecond,
			timeEndYear: poll.timeEndYear,
			timeEndMonth: poll.timeEndMonth,
			timeEndDay: poll.timeEndDay,
			timeEndHour: poll.timeEndHour,
			timeEndMinute: poll.timeEndMinute,
			timeEndSecond: poll.timeEndSecond,
			method: poll.method,
			active: poll.active,
		});
	};

	const savePoll = async () => {
		setLoading(true);
		setConfirmLoading(true);
		if (selectedOptions.question.trim().length <= 0) {
			notification["error"]({
				message: "Ingrese una pregunta / encuesta válida",
			});
			setConfirmLoading(false);
			setLoading(false);
		} else if (
			selectedOptions.method === "Automatic" &&
			selectedOptions.timeStartYear.length <= 0
		) {
			notification["error"]({
				message: "Ingrese una fecha válida",
			});
			setConfirmLoading(false);
			setLoading(false);
		} else if (
			selectedOptions.method === "Automatic" &&
			selectedOptions.timeEndYear.length <= 0
		) {
			notification["error"]({
				message: "Ingrese una fecha válida",
			});
			setConfirmLoading(false);
			setLoading(false);
		} else {
			const resp = await postPollApi(token, selectedOptions);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				setVisible(false);
				setConfirmLoading(false);
				getData();
				setSelectedOptions({
					order: "0",
					question: "",
					timeStartYear: "",
					timeStartMonth: "",
					timeStartDay: "",
					timeStartHour: "",
					timeStartMinute: "",
					timeStartSecond: "",
					timeEndYear: "",
					timeEndMonth: "",
					timeEndDay: "",
					timeEndHour: "",
					timeEndMinute: "",
					timeEndSecond: "",
					method: "Manual",
					active: false,
				});
			} else {
				notification["error"]({
					message: resp.message,
				});
				setConfirmLoading(false);
				setLoading(false);
			}
		}
	};

	const editPoll = async () => {
		setConfirmLoading(true);
		setConfirmLoading2(true);
		const resp = await putQuestionApi(token, updatedOptions, updateOptionId);
		if (resp.ok) {
			notification["success"]({
				message: resp.message,
			});
			getData();
			setVisible2(false);
			setConfirmLoading(false);
			setConfirmLoading2(false);
			setUpdatedOptions({
				order: "0",
				question: "",
				timeStartYear: "",
				timeStartMonth: "",
				timeStartDay: "",
				timeStartHour: "",
				timeStartMinute: "",
				timeStartSecond: "",
				timeEndYear: "",
				timeEndMonth: "",
				timeEndDay: "",
				timeEndHour: "",
				timeEndMinute: "",
				timeEndSecond: "",
				method: "Manual",
				active: false,
			});
			setUpdateOptionId("");
		} else {
			notification["error"]({
				message: resp.message,
			});
			setConfirmLoading(false);
			setConfirmLoading2(false);
		}
	};

	const deletePoll = async (poll) => {
		setLoading(true);
		const resp = await deleteQuestionApi(token, poll._id);
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

	const showOptions = (poll) => {
		setPollId(poll._id);
		setPollStatus(1);
	};

	const onChangeTime = (date, dateString) => {
		try {
			setSelectedOptions({
				...selectedOptions,
				timeStartYear: moment(date[0]).year(),
				timeStartMonth: moment(date[0]).month(),
				timeStartDay: moment(date[0]).date(),
				timeStartHour: moment(date[0]).hour(),
				timeStartMinute: moment(date[0]).minute(),
				timeStartSecond: moment(date[0]).second(),
				timeEndYear: moment(date[1]).year(),
				timeEndMonth: moment(date[1]).month(),
				timeEndDay: moment(date[1]).date(),
				timeEndHour: moment(date[1]).hour(),
				timeEndMinute: moment(date[1]).minute(),
				timeEndSecond: moment(date[1]).second(),
			});
		} catch (error) {
			console.log(error);
		}
	};

	const onChangeTime2 = (date, dateString) => {
		try {
			console.log(date)
			setUpdatedOptions({
				...updatedOptions,
				timeStartYear: moment(date[0]).year(),
				timeStartMonth: moment(date[0]).month(),
				timeStartDay: moment(date[0]).date(),
				timeStartHour: moment(date[0]).hour(),
				timeStartMinute: moment(date[0]).minute(),
				timeStartSecond: moment(date[0]).second(),
				timeEndYear: moment(date[1]).year(),
				timeEndMonth: moment(date[1]).month(),
				timeEndDay: moment(date[1]).date(),
				timeEndHour: moment(date[1]).hour(),
				timeEndMinute: moment(date[1]).minute(),
				timeEndSecond: moment(date[1]).second(),
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="admin-poll">
				{functionStatus ? (
					<div className="container-table">
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otra Encuesta / Pregunta
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
						<h1 className="title">Crear Encuesta / Pregunta</h1>
						<Row>
							<Col span={12}>
								<p>Encuesta / Pregunta</p>
							</Col>
							<Col span={12}>
								<Input
									allowClear
									id="question"
									name="question"
									value={selectedOptions.question}
									onChange={(e) =>
										setSelectedOptions({
											...selectedOptions,
											question: e.target.value,
										})
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<p>Tipo</p>
							</Col>
							<Col span={12}>
								<Select
									defaultValue="Manual"
									style={{ width: "100%" }}
									onChange={(value) =>
										setSelectedOptions({
											...selectedOptions,
											method: value,
										})
									}
								>
									<Option value="Manual">Manual</Option>
									<Option value="Automatic">
										Automático
									</Option>
								</Select>
							</Col>
						</Row>
						{selectedOptions.method === "Automatic" ? (
							<>
								<Row>
									<Col span={12}>
										<p>Fecha</p>
									</Col>
									<Col span={12}>
										<RangePicker
											showTime={{ format: "HH:mm:ss" }}
											format="YYYY-MM-DD HH:mm:ss"
											onChange={onChangeTime}
										/>
									</Col>
								</Row>
							</>
						) : null}
						<Button
							type="primary"
							className="btn"
							onClick={savePoll}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otra Encuesta / Pregunta"
				visible={visible}
				onOk={savePoll}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
			>
				<div className="container-poll">
					<h3 className="title">Agregar</h3>
					<Row>
						<Col span={12}>
							<p>Encuesta / Pregunta</p>
						</Col>
						<Col span={12}>
							<Input
								allowClear
								id="question"
								name="question"
								value={selectedOptions.question}
								onChange={(e) =>
									setSelectedOptions({
										...selectedOptions,
										question: e.target.value,
									})
								}
							/>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<p>Tipo</p>
						</Col>
						<Col span={12}>
							<Select
								defaultValue="Manual"
								style={{ width: "100%" }}
								onChange={(value) =>
									setSelectedOptions({
										...selectedOptions,
										method: value,
									})
								}
							>
								<Option value="Manual">Manual</Option>
								<Option value="Automatic">Automático</Option>
							</Select>
						</Col>
					</Row>
					{selectedOptions.method === "Automatic" ? (
						<>
							<Row>
								<Col span={12}>
									<p>Fecha</p>
								</Col>
								<Col span={12}>
									<RangePicker
										showTime={{ format: "HH:mm:ss" }}
										format="YYYY-MM-DD HH:mm:ss"
										onChange={onChangeTime}
									/>
								</Col>
							</Row>
						</>
					) : null}
				</div>
			</Modal>
			<Modal
				title="Editar Encuesta / Pregunta"
				visible={visible2}
				onOk={editPoll}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<div className="container-poll">
					<h3 className="title">Editar</h3>
					<Row>
						<Col span={12}>
							<p>Encuesta / Pregunta</p>
						</Col>
						<Col span={12}>
							<Input
								allowClear
								id="question"
								name="question"
								value={updatedOptions.question}
								onChange={(e) =>
									setUpdatedOptions({
										...updatedOptions,
										question: e.target.value,
									})
								}
							/>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<p>Tipo</p>
						</Col>
						<Col span={12}>
							<Select
								value={updatedOptions.method}
								style={{ width: "100%" }}
								onChange={(value) =>
									setUpdatedOptions({
										...updatedOptions,
										method: value,
									})
								}
							>
								<Option value="Manual">Manual</Option>
								<Option value="Automatic">Automático</Option>
							</Select>
						</Col>
					</Row>
					{updatedOptions.method === "Automatic" ? (
						<>
							<Row>
								<Col span={12}>
									<p>Fecha</p>
								</Col>
								<Col span={12}>
									<RangePicker
										showTime={{ format: "HH:mm:ss" }}
										format="YYYY-MM-DD HH:mm:ss"
										onChange={onChangeTime2}
									/>
								</Col>
							</Row>
						</>
					) : null}
				</div>
			</Modal>
		</Spin>
	);
};

export default Poll;
