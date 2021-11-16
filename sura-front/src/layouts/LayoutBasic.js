import React from "react";

import { Route, Switch } from "react-router-dom";

export default function LayoutBasic(props) {
	const { routes } = props;

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
