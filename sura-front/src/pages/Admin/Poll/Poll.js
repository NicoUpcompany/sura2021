/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Spin, ConfigProvider, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import es_ES from 'antd/es/locale/es_ES';
import jwtDecode from 'jwt-decode';
import { useHistory } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';

import Socket from '../../../utils/socket';
import { getAccessTokenApi } from '../../../api/auth';
import { getPollAdminApi, getAnswerApi } from '../../../api/Admin/poll';

import './Poll.scss';

const userHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre', dataIndex: 'finalName' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Teléfono', dataIndex: 'phone' },
    { title: 'Cargo', dataIndex: 'position' },
    { title: 'Empresa', dataIndex: 'enterprise' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Respuesta', dataIndex: 'option' },
];

export default function Users() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [pollData, setPollData] = useState([]);

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
                    getPoll(token, interval);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getPoll = async (token, interval) => {
        const resp = await getPollAdminApi(token);
        if (resp.ok) {
            let dataArray = [];
            resp.poll.forEach(element => {
                let datasetArray = [];
                element.options.forEach(item => {
                    let o = Math.round, r = Math.random, s = 255;
                    let color = o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s);
                    let dataset = {
                        id: item._id,
                        datasetKeyProvider: item.option,
                        label: item.option,
                        backgroundColor: 'rgba(' + color + ',0.2)',
                        borderColor: 'rgba(' + color + ',1)',
                        borderWidth: 1,
                        data: [0]
                    }
                    datasetArray.push(dataset);
                });
                let data = {
                    id: element.poll._id,
                    count: 0,
                    labels: [element.poll.question],
                    datasets: datasetArray,
                    users: [],
                };
                dataArray.push(data);
            });
            getAnswers(token, dataArray);
		}
    }
    
    const getAnswers = async (token, dataArray) => {
        const resp = await getAnswerApi(token);
        if (resp.ok) {
            resp.answers.forEach(element => {
                let finalPercentage = "0%";
                const indexPoll = dataArray.findIndex((x) => x.id === element.poll);
                if (indexPoll >= 0) {
                    const indexPollOption = dataArray[indexPoll].datasets.findIndex((x) => x.id === element.pollOption._id);
                    if (indexPollOption >= 0) {
                        // total de votos
                        const totalVotes = dataArray[indexPoll].count + 1;
                        dataArray[indexPoll].count = totalVotes;
                        // votos por respuesta
                        const count = dataArray[indexPoll].datasets[indexPollOption].data[0] + 1;
                        dataArray[indexPoll].datasets[indexPollOption].data[0] = count;
                        // porcentaje de votos
                        let percentage = (count * 100) / totalVotes;
                        percentage = percentage.toFixed(2);
                        finalPercentage = `${percentage}%`;
                        dataArray[indexPoll].datasets[indexPollOption].label = dataArray[indexPoll].datasets[indexPollOption].label + " - " + finalPercentage;
                        // usuarios
                        let finalName = "";
                        if (element.user.fullName.length > 0) {
                            finalName = element.user.fullName;
                        }
                        if (element.user.name.length > 0) {
                            finalName = element.user.name;
                        }
                        if (element.user.lastname.length > 0) {
                            finalName = element.user.name + " " + element.user.lastname;
                        }
                        const userData = {
                            ...element.user,
                            finalName,
                            option: dataArray[indexPoll].datasets[indexPollOption].datasetKeyProvider,
                        }
                        dataArray[indexPoll].users.push(userData);
                    }
                }
            });
            setPollData(dataArray);
            setLoading(false);
		}
    }

    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="votes">
                    {pollData.map((item, i) => {
                        return (
                            <div className="container" key={i}>
                                <h1 className="title-chart">{item.labels} - Total Respuestas: {item.count}</h1>
                                <div className="conexion-info-chart">
                                    <Bar
                                        data={item}
                                        width={500}
                                        height={500}
                                        options={{ maintainAspectRatio: false }}
                                    />
                                </div>
                                <ExportSheet
                                    header={userHeaders}
                                    fileName={item.labels}
                                    dataSource={item.users}
                                    xlsx={XLSX}
                                >
                                    <Button className="_btn" icon={<ExportOutlined />} type="danger">Exportar Votaciones {item.labels}</Button>
                                </ExportSheet>
                            </div>
                        )
                    })}
                </div>
            </Spin>
        </ConfigProvider>
    )
}