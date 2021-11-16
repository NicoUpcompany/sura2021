/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Spin, Table, Input, Space, Button, Avatar, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import es_ES from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';
import { WorldMap } from "react-svg-worldmap";
import { Bar, Pie } from 'react-chartjs-2';
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import "moment/locale/es";

import Socket from '../../../utils/socket';
import { getAccessTokenApi } from '../../../api/auth';

import './Realtime.scss';

let searchInput = "";

export default function RealTime() {

    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [statsData, setStatsData] = useState({});
    const [statsDataDoughnut, setStatsDataDoughnut] = useState({});
    const [peak, setPeak] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
        Socket.emit('GET_USERS', () => {});
        Socket.emit('GET_PEAK', () => {});
        Socket.on('PEAK', peakAux => {
            setPeak(peakAux);
        });
        Socket.on('UPDATE_USER_LIST', users => {
            const countriesArray = [];
            let salaespera = 0;
            let streaming = 0;
            let perfilusuario = 0;
            let unknown = 0;
            let desktop = 0;
            let mobile = 0;
            let tablet = 0;
            let smartTv = 0;
            const usersArray = [];
            users.forEach(item => {
                try {
                    const dataUpdated = {
                        ...item,
                        avatar: <Avatar size="large" style={{marginLeft: '9px'}} src={item.flagIcon} />,
                        conectionTime2: moment(item.conectionTime * 1).add(3, 'hours').format('LLL'),
                    }
                    usersArray.push(dataUpdated);
                    if (item.country !== 'Unknown' && item.country !== '' && item.country !== 'null' && item.country !== null  && 
                        item.country !== undefined && item.country !== 'undefined') {
                        if (countriesArray.some((element) => element.country === item.countryIsoCode)) {
                            const index = countriesArray.findIndex(element => element.country === item.countryIsoCode);
                            countriesArray[index].value = countriesArray[index].value + 1;
                        } else {
                            const data = {
                                country: item.countryIsoCode,
                                value: 1
                            }
                            countriesArray.push(data);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                switch (item.route) {
                    case '/salaespera':
                        salaespera = salaespera + 1;
                        break;
                    case '/streaming':
                        streaming = streaming + 1;
                        break;
                    case '/perfil':
                        perfilusuario = perfilusuario + 1;
                        break;
                    default:
                        unknown = unknown + 1;
                        break;
                }
                switch (item.conectionType) {
                    case 'DESKTOP':
                        desktop = desktop + 1;
                        break;
                    case 'MOBILE':
                        mobile = mobile + 1;
                        break;
                    case 'TABLET':
                        tablet = tablet + 1;
                        break;
                    case 'SMART TV':
                        smartTv = smartTv + 1;
                        break;
                    default:
                        break;
                }
            });
            setCountries(countriesArray);
            const data = {
                labels: ['Conexiones por rutas'],
                datasets: [
                    {
                        label: '/salaespera',
                        backgroundColor: 'rgba(255,159,180,0.5)',
                        data: [salaespera]
                    },
                    {
                        label: '/streaming',
                        backgroundColor: 'rgba(154,208,245,0.5)',
                        data: [streaming]
                    },
                    {
                        label: '/perfil',
                        backgroundColor: 'rgba(255,230,170,0.5)',
                        data: [perfilusuario]
                    },
                    {
                        label: 'Otros',
                        backgroundColor: 'rgba(132,184,76,0.5)',
                        data: [unknown]
                    },
                ]
            };
            const dataDoughnut = {
                datasets: [{
                        data: [desktop, mobile, tablet, smartTv],
                        backgroundColor: ['rgba(255,159,180,0.5)', 'rgba(154,208,245,0.5)', 'rgba(255,230,170,0.5)', 'rgba(132,184,76,0.5)']
                }],
                labels: [ 'Escritorio', 'Teléfono', 'Tablet', 'Smart TV' ],
            };
            setUsersData(usersArray);
            setStatsData(data);
            setStatsDataDoughnut(dataDoughnut);
            setLoading(false);
        });
    }, []);

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
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 90,
        },
        {
            title: 'ID',
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
            title: 'País',
            dataIndex: 'country',
            key: 'country',
            width: 150,
            ...getColumnSearchProps('country'),
        },
        {
            title: 'Ruta',
            dataIndex: 'route',
            key: 'route',
            width: 150,
            filters: [
                {
                    text: 'Sala de espera',
                    value: '/salaespera',
                },
                {
                    text: 'Perfil de usuario',
                    value: '/perfil',
                },
                {
                    text: 'Streaming',
                    value: '/streaming',
                },
                {
                    text: 'Streaming traducido',
                    value: '/streamingtraducido',
                },
            ],
            onFilter: (value, record) => record.route.indexOf(value) === 0
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
            dataIndex: 'conectionTime2',
            key: 'conectionTime2',
            width: 150,
            sorter: (a, b) => (new Date(a).getTime()) - (new Date(b).getTime()),
        },
    ];

    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="realtime">
                    <div className="mapa">
                        {countries.length > 0
                        ?
                            <WorldMap color="#0000a2" title="Usuarios conectados por país" value-suffix="people" size="xl" data={countries} />
                        :
                            <h1>
                                No hay usuarios conectados
                            </h1>
                        }
                    </div>
                    <div className="container">
                        <div className="conexion-info">
                            <h1>Total de usuarios conectados</h1>
                            <span>{usersData.length}</span>
                        </div>
                        <div className="conexion-info-peak">
                            <h1>Peak de usuarios</h1>
                            <strong>Cantidad:</strong> <span>{peak.count}</span> <br />
                            <strong>Tiempo:</strong> <span>{peak.time}</span>
                        </div>
                        <div className="pie-chart">
                            <div className="conexion-info-chart">
                                <Pie
                                    data={statsDataDoughnut}
                                />
                            </div>
                            <div className="conexion-info-chart">
                                <Bar
                                    data={statsData}
                                    width={500}
                                    height={500}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        </div>
                        <div className="conexion-info-chart2">
                            <Table columns={columns} dataSource={usersData} bordered pagination={true} scroll={{ x: 1500, y: 'calc(100vh + 30px)' }} sticky />   
                        </div>
                        
                    </div>
                    
                </div>
            </Spin>
        </ConfigProvider>
    )
}