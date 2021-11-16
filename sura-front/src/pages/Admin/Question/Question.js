/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin, Table, Input, Space, Button, ConfigProvider, notification } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import jwtDecode from 'jwt-decode';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getQuestionApi, deleteQuestionApi } from '../../../api/question';
import { getAccessTokenApi } from '../../../api/auth';

import './Question.scss';

const questionHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'ID Usuario', dataIndex: 'userID' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Pregunta', dataIndex: 'question' },
    { title: 'Día y hora', dataIndex: 'time' },
];

let searchInput = "";

export default function Users() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [questionData, setQuestionData] = useState([]);

    useEffect(() => {
        try {
            setLoading(true);
            let interval;
            const token = getAccessTokenApi();
            if (token === null) {
                history.push("/dashboard/iniciarsesion");
            } else {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'Admin') {
                    history.push("/dashboard/iniciarsesion");
                } else {
                    const user = {
                        id: decodedToken.id,
                        route: window.location.pathname
                    }
                    Socket.emit('UPDATE_ROUTE', user);
                    interval = setInterval(() => {
                        getQuestions(token);
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getQuestions = async (token) => {
        await getQuestionApi(token).then(resp => {
            const questionArray = [];
            if (resp.ok) {
                resp.preguntas.forEach(item => {
                    let name;
                    if (item.user.name.length > 0) {
                        name = item.user.name;
                    }
                    if (item.user.lastname.length > 0) {
                        name = name + " " + item.user.lastname;
                    }
                    if (item.user.fullName.length > 0) {
                        name = item.user.fullName;
                    }
                    const element = {
                        ...item,
                        userID: item.user._id,
                        name: name,
                        email: item.user.email,
                        key: item._id
                    }
                    questionArray.push(element);
                });
            }
            setQuestionData(questionArray);
            setLoading(false);
        });
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={'Buscar'}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Limpiar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.select(), 100);
                }
            },
            render: text =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
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

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const deleteQuestion = async question => {
        setLoading(true);
        const token = getAccessTokenApi();
        if (token !== null) {
            await deleteQuestionApi(token, question._id).then(resp => {
                if (!resp.ok) {
                    notification["error"]({
                        message: resp.message
                    });
                } else {
                    notification["success"]({
                        message: resp.message
                    });
                }
                getQuestions(token);
            });
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 150,
            ...getColumnSearchProps('_id'),
        },
        {
            title: 'ID Usuario',
            dataIndex: 'userID',
            key: 'userID',
            width: 150,
            ...getColumnSearchProps('userID'),
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
            width: 150,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Pregunta',
            dataIndex: 'question',
            key: 'question',
            width: 150,
            ...getColumnSearchProps('question'),
        },
        {
            title: 'Día y hora',
            dataIndex: 'time',
            key: 'time',
            width: 150,
            ...getColumnSearchProps('time'),
        },
        {
            title: 'Opción',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
				<>
                    <a onClick={() => deleteQuestion(record)}>Eliminar</a>
				</>
			)
        },
    ];
    
    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="users">
                    <h1 className="title">Listado de preguntas</h1>
                    <Table columns={columns} dataSource={questionData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                    <ExportSheet
                        header={questionHeaders}
                        fileName={`lista_preguntas`}
                        dataSource={questionData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" icon={<ExportOutlined />} type="danger">Exportar Preguntas</Button>
                    </ExportSheet>
                </div>
            </Spin>
        </ConfigProvider>
    )
}