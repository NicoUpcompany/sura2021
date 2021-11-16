import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, PoweroffOutlined } from '@ant-design/icons';

import { logout } from '../../../api/auth';

import up from '../../../assets/img/dashboard/up.png';
import logo from '../../../assets/img/dashboard/logo.svg';

import './MenuTop.scss';

export default function MenuTop(props) {

    const { menuCollapsed, setMenuCollapsed } = props;

    const logoutUser = () => {
        logout();
        window.location.reload();
    }

    return (
        <div className="menu-top">
            <div className="menu-top__left">
                <Link to={"/dashboard"}>
                    {menuCollapsed ? (
                        <img className="menu-top__left-logo" src={up} alt="UpCompany" />
                    ) : (
                        <img className="menu-top__left-logo" style={{width: '150px', margin: '0'}} src={logo} alt="UpCompany" />
                    )}
                </Link>
                <Button type="link" onClick={() => setMenuCollapsed(!menuCollapsed)}>
                    {menuCollapsed ? (
                        <MenuUnfoldOutlined />
                     ) : (
                        <MenuFoldOutlined />
                     )}
                </Button>
            </div>
            <div className="menu-top__right">
                <Button type="link" onClick={logoutUser}>
                    <PoweroffOutlined />
                </Button>
            </div>
        </div>
    );
}