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

import {
	postPollOptionApi,
	getPollOptionApi,
	putPollOptionApi,
	deletePollOptionpi,
} from "../../../../api/Admin/poll";

import "./PollOption.scss";

let searchInput = "";

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

const PollOption = (props) => {
	const { token, setPollStatus, pollId } = props;

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
		option: "",
		poll: pollId,
	});
	const [updatedOptions, setUpdatedOptions] = useState({
		order: "0",
		option: "",
		poll: pollId,
	});

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getPollOptionApi(token, pollId);
		if (resp.ok) {
			const array = [];
			let cont = 0;
			resp.options.forEach((item) => {
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
				putPollOptionApi(token, item, item._id);
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
			title: "Alternativa",
			dataIndex: "option",
			className: "drag-visible",
			...getColumnSearchProps("option"),
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
						onConfirm={() => deletePollOption(record)}
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

	const openEditModal = (pollOption) => {
		setVisible2(true);
		setUpdateOptionId(pollOption._id);
		setUpdatedOptions({
			order: pollOption.order,
			option: pollOption.option,
			poll: pollOption.poll,
		});
	};

	const savePollOption = async () => {
		setLoading(true);
		setConfirmLoading(true);
		if (selectedOptions.option.trim().length <= 0) {
			notification["error"]({
				message: "Ingrese una alternativa válida",
			});
			setConfirmLoading(false);
			setLoading(false);
		} else {
			const resp = await postPollOptionApi(token, selectedOptions);
			if (resp.ok) {
				notification["success"]({
					message: resp.message,
				});
				setVisible(false);
				setConfirmLoading(false);
				getData();
				setSelectedOptions({
					order: "0",
					option: "",
					poll: pollId,
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

	const editPollOption = async () => {
		setConfirmLoading(true);
		setConfirmLoading2(true);
		const resp = await putPollOptionApi(token, updatedOptions, updateOptionId);
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
                option: "",
                poll: pollId,
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

	const deletePollOption = async (pollOption) => {
		setLoading(true);
		const resp = await deletePollOptionpi(token, pollOption._id);
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
			<div className="admin-poll-option">
				{functionStatus ? (
					<div className="container-table">
                        <Button
							type="primary"
							className="arrow"
							onClick={() => setPollStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<Button
							type="primary"
							className="btn"
							onClick={() => setVisible(true)}
						>
							Agregar otra alternativa
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
							onClick={() => setPollStatus(0)}
						>
							<ArrowLeftOutlined />
							Volver
						</Button>
						<h1 className="title">Crear Alternativa</h1>
						<Row>
							<Col span={12}>
								<p>Alternativa</p>
							</Col>
							<Col span={12}>
								<Input
									allowClear
									id="option"
									name="option"
									value={selectedOptions.option}
									onChange={(e) =>
										setSelectedOptions({
											...selectedOptions,
											option: e.target.value,
										})
									}
								/>
							</Col>
						</Row>
						<Button
							type="primary"
							className="btn"
							onClick={savePollOption}
						>
							Guardar
						</Button>
					</div>
				)}
			</div>
			<Modal
				title="Agregar otra alternativa"
				visible={visible}
				onOk={savePollOption}
				confirmLoading={confirmLoading}
				onCancel={() => setVisible(false)}
			>
				<div className="container-poll-option">
					<h3 className="title">Agregar</h3>
					<Row>
						<Col span={12}>
							<p>Alternativa</p>
						</Col>
						<Col span={12}>
                            <Input
                                allowClear
                                id="option"
                                name="option"
                                value={selectedOptions.option}
                                onChange={(e) =>
                                    setSelectedOptions({
                                        ...selectedOptions,
                                        option: e.target.value,
                                    })
                                }
                            />
						</Col>
					</Row>
				</div>
			</Modal>
			<Modal
				title="Editar Alternativa"
				visible={visible2}
				onOk={editPollOption}
				confirmLoading={confirmLoading2}
				onCancel={() => setVisible2(false)}
			>
				<div className="container-poll-option">
					<h3 className="title">Editar</h3>
					<Row>
						<Col span={12}>
							<p>Alternativa</p>
						</Col>
						<Col span={12}>
                            <Input
                                allowClear
                                id="option"
                                name="option"
                                value={updatedOptions.option}
                                onChange={(e) =>
                                    setUpdatedOptions({
                                        ...updatedOptions,
                                        option: e.target.value,
                                    })
                                }
                            />
						</Col>
					</Row>
				</div>
			</Modal>
		</Spin>
	);
};

export default PollOption;
