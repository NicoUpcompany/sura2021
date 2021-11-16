import React, { useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import { Layout } from "antd";

import MenuTop from "../components/Admin/MenuTop";
import MenuSidebar from "../components/Admin/MenuSidebar";
import AdminSignIn from "../pages/Admin/SignIn/SignIn";
import useAuth from "../hooks/useAuth";

import "./LayoutAdmin.scss";

export default function LayoutAdmin(props) {
	const { routes } = props;
	const [menuCollapsed, setMenuCollapsed] = useState(false);
	const { Header, Content } = Layout;
	const { user, isLoading } = useAuth();

	if (!user && !isLoading) {
		return (
			<>
				<Route
					path="/dashboard/iniciarsesion"
					component={AdminSignIn}
				/>
				<Redirect to="/dashboard/iniciarsesion" />
			</>
		);
	}

	if (user && !isLoading) {
		return (
			<Layout>
				<MenuSidebar menuCollapsed={menuCollapsed} />
				<Layout
					className="layout-admin"
					style={{ marginLeft: menuCollapsed ? "80px" : "200px" }}
				>
					<Header className="layout-admin__header">
						<MenuTop
							menuCollapsed={menuCollapsed}
							setMenuCollapsed={setMenuCollapsed}
						/>
					</Header>
					<Content className="layout-admin__content">
						<LoadRoutes routes={routes} />
					</Content>
				</Layout>
			</Layout>
		);
	}

	return null;
}

function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route
					key={index}
					path={route.path}
					exact={route.exact}
					component={route.component}
				/>
			))}
		</Switch>
	);
}
