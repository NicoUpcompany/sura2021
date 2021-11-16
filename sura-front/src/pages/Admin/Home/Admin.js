/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { notification, Spin, Table, Input, Space, Button, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import jwtDecode from 'jwt-decode';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getUsersApi } from '../../../api/user';
import { getQuestionApi } from '../../../api/question';
import { getAccessTokenApi } from '../../../api/auth';

import up5 from '../../../assets/img/dashboard/5.png';

import './Admin.scss';

const userHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre', dataIndex: 'nameAux' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Rut', dataIndex: 'rut' },
    { title: 'Empresa', dataIndex: 'enterprise' },
    { title: 'Cargo', dataIndex: 'position' },
    { title: 'Teléfono', dataIndex: 'phone' },
    { title: 'País', dataIndex: 'country' },
    { title: 'Dirección', dataIndex: 'adress' },
    { title: 'Otro', dataIndex: 'other' },
    { title: 'Rol', dataIndex: 'role' },
    { title: 'Día y hora de registro', dataIndex: 'signUpTime' },
    { title: 'Último inicio de sesión', dataIndex: 'signInTime' },
    { title: 'Última conexión sala de espera', dataIndex: 'waitingRoomTime' },
    { title: 'Última conexión stream', dataIndex: 'streamTime' },
];

const questionHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Pregunta', dataIndex: 'question' },
    { title: 'Día y hora', dataIndex: 'time' },
];

let searchInput = "";

export default function Admin() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [signInCount, setSignInCount] = useState(0);
    const [singUpCount, setSingUpCount] = useState(0);
    const [waitingRoomCount, setWaitingRoom] = useState(0);
    const [streamCount, setStreamCount] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [usersData, setUsersData] = useState([]);
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
                        getUsers(token);
                        getQuestions(token);
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getUsers = async (token) => {
        let signUp = 0;
        let signIn = 0;
        let waitingRoom = 0;
        let stream = 0;
        await getUsersApi(token).then(resp => {
            const arrayUsers = [];
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                signUp = resp.users.length;
                resp.users.forEach(item => {
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
                    if (item.signInTime !== '0') {
                        signIn = signIn + 1;
                    }
                    if (item.waitingRoomTime !== '0') {
                        waitingRoom = waitingRoom + 1;
                    }
                    if (item.streamTime !== '0') {
                        stream = stream + 1;
                    }
                    const element = {
                        ...item,
                        nameAux: name,
                        key: item._id
                    }
                    arrayUsers.push(element);
                });
            }
            setUsersData(arrayUsers);
            setSingUpCount(signUp);
            setSignInCount(signIn);
            setWaitingRoom(waitingRoom);
            setStreamCount(stream);
            setLoading(false);
        });
    }

    const getQuestions = async (token) => {
        await getQuestionApi(token).then(resp => {
            if (resp.ok) {
                const arrayQuestions = [];
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
                    const data = {
                        ...item,
                        name: name,
                    }
                    arrayQuestions.push(data);
                });
                setQuestionData(arrayQuestions);
                setLoading(false);
            }
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

    const columns = [
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
            fixed: 'left',
            width: 150,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 150,
            ...getColumnSearchProps('_id'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nameAux',
            key: 'nameAux',
            width: 150,
            ...getColumnSearchProps('nameAux'),
        },
        {
            title: 'Rut',
            dataIndex: 'rut',
            key: 'rut',
            width: 150,
            ...getColumnSearchProps('rut'),
        },
        {
            title: 'Empresa',
            dataIndex: 'enterprise',
            key: 'enterprise',
            width: 150,
            ...getColumnSearchProps('enterprise'),
        },
        {
            title: 'Cargo',
            dataIndex: 'position',
            key: 'position',
            width: 150,
            ...getColumnSearchProps('position'),
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'País',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            ...getColumnSearchProps('country'),
        },
        {
            title: 'Dirección',
            dataIndex: 'adress',
            key: 'adress',
            width: 150,
            ...getColumnSearchProps('adress'),
        },
        {
            title: 'Campo otros',
            dataIndex: 'other',
            key: 'other',
            width: 150,
            ...getColumnSearchProps('other'),
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            filters: [
                {
                    text: 'Administrador',
                    value: 'Admin',
                },
                {
                    text: 'Usuario',
                    value: 'User',
                }
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0
        },
        {
            title: 'Día y hora de registro',
            dataIndex: 'signUpTime',
            key: 'signUpTime',
            width: 150,
            sorter: (a, b) => a.signUpTime.length - b.signUpTime.length,
        },
        {
            title: 'Último inicio de sesión',
            dataIndex: 'signInTime',
            key: 'signInTime',
            width: 150,
            sorter: (a, b) => a.signInTime.length - b.signInTime.length,
        },
        {
            title: 'Última conexión sala de espera',
            dataIndex: 'waitingRoomTime',
            key: 'waitingRoomTime',
            width: 150,
            sorter: (a, b) => a.waitingRoomTime.length - b.waitingRoomTime.length,
        },
        {
            title: 'Última conexión stream',
            dataIndex: 'streamTime',
            key: 'streamTime',
            width: 150,
            sorter: (a, b) => a.streamTime.length - b.streamTime.length,
        },
    ];
    
    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="dashboard">
                    <div className="contenedor">
                        <div className="row">
                            <div className="mid mid-l">
                                <div className="data">
                                <div>
                                    <div className="box">
                                        <div className="icon ico1"></div>
                                        {singUpCount}
                                        <span>Registrados</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico2"></div>
                                        {signInCount}
                                        <span>Iniciaron sesión</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico3"></div>
                                        {waitingRoomCount}
                                        <span>Sala espera</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico4"></div>
                                        {streamCount}
                                        <span>Sala streaming</span>
                                    </div>
                                </div>
                                </div>
                                <div className="box-la">
                                    <div className="list">
                                        <Table columns={columns} dataSource={usersData} bordered pagination={true} scroll={{ x: '70vw', y: 240 }} />
                                    </div>
                                </div>
                                <div className="btns">
                                    <ExportSheet
                                        header={userHeaders}
                                        fileName={`lista_usuarios`}
                                        dataSource={usersData}
                                        xlsx={XLSX}
                                    >
                                        <button className="btn" style={{cursor: 'pointer'}}>Exportar participantes<img src={up5} alt="Exportar participantes" width="15"/></button>
                                    </ExportSheet>
                                    <ExportSheet
                                        header={questionHeaders}
                                        fileName={`lista_preguntas`}
                                        dataSource={questionData}
                                        xlsx={XLSX}
                                    >
                                        <button className="btn">Exportar preguntas<img src={up5} alt="Exportar preguntas" width="15"/></button>
                                    </ExportSheet>
                                </div>
                                
                            </div>
                            <div className="mid mid-s">
                                <div className="cont-preguntas">
                                    <h3>Preguntas</h3>
                                    <div className="preguntas-list">
                                        {questionData.map((item, i) => {
                                            return (
                                                <p key={i}><strong>{item.name}</strong>{item.question}</p>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </ConfigProvider>
    )
}