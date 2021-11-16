import React, { useEffect } from "react";
import { Layout} from 'antd';
import jwtDecode from "jwt-decode";

import Socket from '../../../utils/socket';
import up from '../../../assets/img/dashboard/up.png';
import LoginForm from '../../../components/Admin/LoginForm';
import { getAccessTokenApi } from "../../../api/auth";

import "./SignIn.scss";

export default function SignIn() {

    useEffect(() => {
        const token = getAccessTokenApi();
        if (token !== null) {
            const decodedToken = jwtDecode(token);
            if (decodedToken) {
                const user = {
                    id: decodedToken.id,
                    route: window.location.pathname
                }
                Socket.emit('UPDATE_ROUTE', user);
            }
        }
    }, []);

    const { Content } = Layout;

    return (
        <Layout className="sign-in">
            <Content className="sign-in__content">
                <h1 className="sign-in__content-logo">
                    <img src={up} alt="Up Company" />
                </h1>
                <div className="sign-in__content-tabs">
                    <LoginForm />
                </div>
            </Content>
        </Layout>
    )
}