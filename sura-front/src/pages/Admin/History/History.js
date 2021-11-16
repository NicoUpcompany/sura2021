/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Spin, Table, Input, Space, Button, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import moment from 'moment';
import "moment/locale/es";
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getAccessTokenApi } from '../../../api/auth';
import { getRealTimeDataApi } from '../../../api/realtime';

import './History.scss';

const historyHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'ID usuario', dataIndex: 'userID' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'País Ingresado', dataIndex: 'userCountry' },
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
    { title: 'Tiempo de conexión', dataIndex: 'average' },
];

let searchInput = "";

export default function Events() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [realTimeData, setRealTimeData] = useState([]);
    const [average, setAverage] = useState('');

    useEffect(() => {
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
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const interval = setInterval(() => {
            getRealTimeData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getRealTimeData = async () => {
        const result = await getRealTimeDataApi();
        let sum = 0;
        const realTimeArray = [];
        if (result.ok) {
            result.realTimeData.forEach(element => {
                const rest =  element.conectionTimeEnd - element.conectionTime;
                sum = sum + rest;
                const hours_t = Math.floor((rest % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes_t = Math.floor((rest % (1000 * 60 * 60)) / (1000 * 60));
                const seconds_t = Math.floor((rest % (1000 * 60)) / 1000);
                let data;
                if (element.user) {
                    let name;
                    if (element.user.name.length > 0) {
                        name = element.user.name;
                    }
                    if (element.user.lastname.length > 0) {
                        name = name + " " + element.user.lastname;
                    }
                    if (element.user.fullName.length > 0) {
                        name = element.user.fullName;
                    }
                    data = {
                        ...element,
                        key: element._id,
                        userID: element.user._id,
                        name: name,
                        email: element.user.email,
                        conectionTime: moment(element.conectionTime * 1).add(3, 'hours').format('LLL'),
                        conectionTimeEnd: moment(element.conectionTimeEnd * 1).add(3, 'hours').format('LLL'),
                        average: `${hours_t} horas, ${minutes_t} minutos, ${seconds_t} segundos.`
                    }
                } else {
                    data = {
                        ...element,
                        key: element._id,
                        userID: "Desconocido",
                        name: "Desconocido",
                        email: "Desconocido",
                        conectionTime: moment(element.conectionTime * 1).add(3, 'hours').format('LLL'),
                        conectionTimeEnd: moment(element.conectionTimeEnd * 1).add(3, 'hours').format('LLL'),
                        average: `${hours_t} horas, ${minutes_t} minutos, ${seconds_t} segundos.`
                    }
                }
                realTimeArray.push(data);
            });
            if (sum > 0) {
                const average = sum / result.realTimeData.length;
                // const days_t = Math.floor(average / (1000 * 60 * 60 * 24));
                const hours_t = Math.floor((average % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes_t = Math.floor((average % (1000 * 60 * 60)) / (1000 * 60));
                const seconds_t = Math.floor((average % (1000 * 60)) / 1000);
                setAverage(`${hours_t} horas, ${minutes_t} minutos, ${seconds_t} segundos.`);
            }
            setRealTimeData(realTimeArray);
        }
        setLoading(false);
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
        {
            title: 'Tipo Conexión',
            dataIndex: 'conectionType',
            key: 'conectionType',
            width: 150,
            filters: [
                {
                    text: 'Escritorio',
                    value: 'DESKTOP',
                },
                {
                    text: 'Teléfono',
                    value: 'MOBILE',
                },
                {
                    text: 'Tablet',
                    value: 'TABLET',
                },
                {
                    text: 'Smart TV',
                    value: 'SMART TV',
                },
            ],
            onFilter: (value, record) => record.conectionType.indexOf(value) === 0
        },
        {
            title: 'Día y hora ingreso',
            dataIndex: 'conectionTime',
            key: 'conectionTime',
            width: 150,
            sorter: (a, b) => a.conectionTime.length - b.conectionTime.length,
        },
        {
            title: 'Día y hora salida',
            dataIndex: 'conectionTimeEnd',
            key: 'conectionTimeEnd',
            width: 150,
            sorter: (a, b) => a.conectionTimeEnd.length - b.conectionTimeEnd.length,
        },
        {
            title: 'Tiempo de conexión',
            dataIndex: 'average',
            key: 'average',
            width: 150,
            sorter: (a, b) => a.average.length - b.average.length,
        },
    ];
    
    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="history">
                    <div className="container">
                        <div className="conexion-info-average">
                            <h1>Tiempo de conexión promedio</h1>
                            <span>{average}</span>
                        </div>
                    </div>
                    <h1 className="title">Historial de conexión</h1>
                    <Table columns={columns} dataSource={realTimeData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} />
                    <ExportSheet
                        header={historyHeaders}
                        fileName={`historial_conexion`}
                        dataSource={realTimeData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" icon={<ExportOutlined />} type="danger">Exportar historial</Button>
                    </ExportSheet>
                </div>
            </Spin>
        </ConfigProvider>
    )
}