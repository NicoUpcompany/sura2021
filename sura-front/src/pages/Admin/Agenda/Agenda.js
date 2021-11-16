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
import { getUserAgengaApi } from '../../../api/userAgenda';
import { getAccessTokenApi } from '../../../api/auth';

import './Agenda.scss';

const dataHeaders = [
    { title: 'ID usuario', dataIndex: 'userId' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Rut', dataIndex: 'rut' },
    { title: 'Empresa', dataIndex: 'enterprise' },
    { title: 'Cargo', dataIndex: 'position' },
    { title: 'Teléfono', dataIndex: 'phone' },
    { title: 'País', dataIndex: 'country' },
    { title: 'Dirección', dataIndex: 'adress' },
    { title: 'Otro', dataIndex: 'other' },
    { title: 'Ruta', dataIndex: 'route' },
    { title: 'Dirección IP', dataIndex: 'ipAddress' },
    { title: 'Tipo Dirección IP', dataIndex: 'ipType' },
    { title: 'Ubicación', dataIndex: 'locationLatLong' },
    { title: 'Margen ubicación', dataIndex: 'accuracyRadius' },
    { title: 'Continente', dataIndex: 'continent' },
    { title: 'Código Continente', dataIndex: 'continentCode' },
    { title: 'País Detectado', dataIndex: 'country' },
    { title: 'Código País Detectado', dataIndex: 'countryIsoCode' },
    { title: 'Región', dataIndex: 'region' },
    { title: 'Código Región', dataIndex: 'regionIsoCode' },
    { title: 'Estado / Provincia', dataIndex: 'city' },
    { title: 'Código Postal', dataIndex: 'postalCode' },
    { title: 'Zona horaria', dataIndex: 'timeZone' },
    { title: 'Navegador', dataIndex: 'navigatorName' },
    { title: 'Sistema Operativo', dataIndex: 'operatingSystem' },
    { title: 'Tipo Conexión', dataIndex: 'conectionType' },
    { title: 'Proveedor de internet', dataIndex: 'isp' },
    { title: 'Día y hora ingreso', dataIndex: 'conectionTime' },
    { title: 'Día y hora salida', dataIndex: 'conectionTimeEnd' },
];

let searchInput = "";

export default function Events() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        try {
            setLoading(true);
            let interval;
            const auxToken = getAccessTokenApi();
            if (auxToken === null) {
                history.push("/dashboard/iniciarsesion");
            } else {
                const decodedToken = jwtDecode(auxToken);
                if (decodedToken.role !== 'Admin') {
                    history.push("/dashboard/iniciarsesion");
                } else {
                    const user = {
                        id: decodedToken.id,
                        route: window.location.pathname
                    }
                    Socket.emit('UPDATE_ROUTE', user);
                    interval = setInterval(() => {
                        getEvents(auxToken);
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getEvents = async (token) => {
        await getUserAgengaApi(token).then(resp => {
            const arrayData = [];
            if (resp.ok) {
                resp.data.forEach(item => {
                    const usersArray = [];
                    item.users.forEach(element => {
                        usersArray.push(element);
                        // if (element.route === "/streaming" || element.route === "/streamingtraducido") {
                        // }
                    });
                    item.users = usersArray
                    const finalData = {
                        ...item,
                        key: item._id
                    }
                    arrayData.push(finalData);
                });
            }
            setData(arrayData);
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
            title: 'ID Usuario',
            dataIndex: 'userId',
            key: 'userId',
            width: 150,
            ...getColumnSearchProps('userId'),
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
            title: 'Ruta',
            dataIndex: 'route',
            key: 'route',
            width: 150,
            ...getColumnSearchProps('route'),
        },
        {
            title: 'Tipo Conexión',
            dataIndex: 'conectionType',
            key: 'conectionType',
            width: 150,
            ...getColumnSearchProps('conectionType'),
        },
        {
            title: 'País',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            ...getColumnSearchProps('country'),
        },
        {
            title: 'Región',
            dataIndex: 'region',
            key: 'region',
            width: 150,
            ...getColumnSearchProps('region'),
        },
        {
            title: 'Estado / Provincia',
            dataIndex: 'city',
            key: 'city',
            width: 150,
            ...getColumnSearchProps('city'),
        },
    ];
    
    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} style={{marginTop: '150px'}} size="large" tip="Cargando...">
                {data.length > 0
                    ?
                        <>
                            {data.map((item, i) => {
                                return (
                                    <div className="agenda">
                                        <div className="container">
                                            <p className="description">Día {item.day} de {item.hour} a {item.hourEnd} hrs.</p>
                                            <h1 className="title">{item.title}</h1><p className="peak">Peak {item.peakCount} - {item.peakTime}</p>
                                        </div>
                                        <Table columns={columns} dataSource={item.users} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                                        <ExportSheet
                                            header={dataHeaders}
                                            fileName="conexiones_agenda"
                                            dataSource={item.users}
                                            xlsx={XLSX}
                                        >
                                            <Button className="_btn" icon={<ExportOutlined />} type="danger">Exportar conexiones</Button>
                                        </ExportSheet>
                                    </div>
                                )
                            })}
                        </>
                    :
                        <>
                            {loading
                                ?
                                    <></>
                                :
                                    <h1 className="no-data">No hay datos</h1>
                            }
                        </>
                }
            </Spin>
        </ConfigProvider>
    )
}