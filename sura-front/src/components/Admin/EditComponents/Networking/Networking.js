/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
	Button,
	Spin,
	Row,
	Col,
	notification,
} from "antd";
import moment from "moment";
import "moment/locale/es";

import {
	postAddNewAppApi,
    postLoginApi,
    getNetworkingApi,
    postNetworkingApi,
    deleteUserChatApi,
    deleteGroupChatApi,
    postGroupChatApi
} from "../../../../api/Admin/networking";
import {
	getEventOptionsApi,
} from "../../../../api/Admin/eventOptions";

import "./Networking.scss";


const Networking = (props) => {
	const { token } = props;

	const [loading, setLoading] = useState(false);
	const [state, setState] = useState(false);
	const [networkingId, setNetworkingId] = useState("");
	const [data, setData] = useState({
        name: "",
        APP_ID: "",
        REGION: "us",
        AUTH_KEY: "",
        trialEndsAt: "",
    });

	useEffect(() => {
		setLoading(true);
		getData();
	}, []);

	const getData = async () => {
		const resp = await getNetworkingApi();
        if (resp.ok) {
            setNetworkingId(resp.networking._id);
            console.log("Entro aqui")
            setData({
                ...data,
                name: resp.networking.name,
                APP_ID: resp.networking.APP_ID,
                AUTH_KEY: resp.networking.AUTH_KEY,
                trialEndsAt: resp.networking.trialEndsAt,
            });
            setState(true);
            setLoading(false);
        } else {
            setState(false);
            setLoading(false);
        }
	};

	const saveOrUpdateOptions = async () => {
		setLoading(true);
        const resp = await getEventOptionsApi();
		if (resp.ok) {
            let name = `${resp.optionsEvent.title}${moment().valueOf()}`;
            name = name.substring(0, 20);
            const cometchatData = {
                "metadata" : {
                    "technologies": ["react"],
                    "technology_other": "",
                    "useCase": "other",
                    "useCase_other": "Networking"
                },
                "name": name,
                "region": "us",
                "version": "2"
            }
            const cometchatLoginData = {
                email: "orlando@upcompany.cl",
	            password: "orlando123",
            }
            const loginResult = await postLoginApi(cometchatLoginData);
            if (!loginResult.data) {
                notification["error"]({
                    message: "Error en credenciales networking",
                });
                setLoading(false);
            } else {
                const result = await postAddNewAppApi(cometchatData, loginResult.data.token);
                console.log(result)
                if (!result.data) {
                    notification["error"]({
                        message: "Error al generar networking",
                    });
                    setLoading(false);
                } else {
                    const apiKeysAux = Object.keys(result.data.apiKeys)[0];
                    const apiKeys = Object.keys(result.data.apiKeys)[1];
                    const sendData = {
                        name: result.data.name,
                        APP_ID: result.data.id,
                        AUTH_KEY: apiKeys,
                        trialEndsAt: result.data.trialEndsAt,
                    }
                    const response = await postNetworkingApi(token, sendData);
                    if (response.ok) {
                        setNetworkingId(response.networkingId);
                        notification["success"]({
                            message: response.message,
                        });
                        deleteUserChatApi("superhero1", result.data.id, apiKeysAux);
                        deleteUserChatApi("superhero2", result.data.id, apiKeysAux);
                        deleteUserChatApi("superhero3", result.data.id, apiKeysAux);
                        deleteUserChatApi("superhero4", result.data.id, apiKeysAux);
                        deleteUserChatApi("superhero5", result.data.id, apiKeysAux);
                        deleteGroupChatApi("supergroup", result.data.id, apiKeysAux);
                        const groupData = {
                            guid: "chat_general",
                            name: "Chat General",
                            type: "public",
                        };
                        postGroupChatApi(groupData, result.data.id, apiKeysAux);
                        getData();
                    } else {
                        notification["error"]({
                            message: response.message,
                        });
                        setLoading(false);
                    }
                }
            }
		}
	};

	return (
		<Spin spinning={loading} size="large" tip="Cargando...">
			<div className="networking">
				<Row>
					<Col span={24}>
                        {state ? (
                            <div className="container">
                                <h2>¡Chat Activado!</h2>
                                <h3>Credenciales</h3>
                                <p>Nombre App : {data.name}</p>
                                <p>APP_ID     : {data.APP_ID}</p>
                                <p>REGION     : {data.REGION}</p>
                                <p>AUTH_KEY   : {data.AUTH_KEY}</p>
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                className="button"
                                shape="round"
                                htmlType="submit"
                                onClick={() => saveOrUpdateOptions()}
                            >
                                    <span>Generar networking</span>
                            </Button>
                        )}
					</Col>
				</Row>
			</div>
		</Spin>
	);
};

export default Networking;
