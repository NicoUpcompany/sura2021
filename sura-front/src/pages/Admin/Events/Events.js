/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin, Table, Input, Space, Button, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import jwtDecode from 'jwt-decode';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getEventsApi } from '../../../api/events';
import { getAccessTokenApi } from '../../../api/auth';

import './Events.scss';

const eventHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'ID usuario', dataIndex: 'userID' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Tipo Conexión', dataIndex: 'conectionType' },
    { title: 'Día y hora', dataIndex: 'conectionTime' },
    { title: 'Ruta', dataIndex: 'page' },
    { title: 'Stand', dataIndex: 'stand' },
    { title: 'Acción', dataIndex: 'action' },
    { title: 'Descripción', dataIndex: 'description' },
];

let searchInput = "";

export default function Events() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [eventData, setEventData] = useState([]);

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
                        getEvents(token);
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getEvents = async (token) => {
        await getEventsApi(token).then(resp => {
            const arrayEvents = [];
            if (resp.ok) {
                resp.eventos.forEach(item => {
                    let element;
                    if (item.user === null) {
                        element = {
                            ...item,
                            userID: 'Desconocido',
                            name: 'Desconocido',
                            email: 'Desconocido',
                            key: item._id
                        }
                    } else {
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
                        element = {
                            ...item,
                            userID: item.user._id,
                            name: name,
                            email: item.user.email,
                            key: item._id
                        }
                    }
                    arrayEvents.push(element);
                });
            }
            setEventData(arrayEvents);
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

    const columns = [
        {
            title: 'ID Evento',
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
            title: 'Tipo Conexión',
            dataIndex: 'conectionType',
            key: 'conectionType',
            width: 150,
            ...getColumnSearchProps('conectionType'),
        },
        {
            title: 'Día y hora',
            dataIndex: 'conectionTime',
            key: 'conectionTime',
            width: 150,
            sorter: (a, b) => a.conectionTime.length - b.conectionTime.length,
        },
        {
            title: 'Ruta',
            dataIndex: 'page',
            key: 'page',
            width: 150,
            ...getColumnSearchProps('page'),
        },
        {
            title: 'Acción',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            ...getColumnSearchProps('action'),
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            ...getColumnSearchProps('description'),
        },
    ];
    
    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="events">
                    <h1 className="title">Listado de Eventos</h1>
                    <Table columns={columns} dataSource={eventData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                    <ExportSheet
                        header={eventHeaders}
                        fileName={`lista_eventos`}
                        dataSource={eventData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" icon={<ExportOutlined />} type="danger">Exportar eventos</Button>
                    </ExportSheet>
                </div>
            </Spin>
        </ConfigProvider>
    )
}