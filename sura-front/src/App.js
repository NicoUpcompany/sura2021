import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
	browserName,
	browserVersion,
	fullBrowserVersion,
	osName,
	osVersion,
	isMobileOnly,
	isTablet,
	isSmartTV,
} from "react-device-detect";
import { Helmet } from "react-helmet";
import { BackTop } from 'antd';

import { getAccessTokenApi } from "./api/auth";
import { basePath, apiVersion } from "./api/config";
import { getEventOptionsApi } from "./api/Admin/eventOptions";
import { publicIpApi, geoIpApi } from "./api/realtime";
import routes from "./config/routes";
import AuthProvider from "./providers/AuthProvider";
import * as actions from "./store/action";
import Socket from "./utils/socket";

import "./App.scss";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: false,
			title: "Cargando...",
			description: "Cargando...",
			favicon: "",
			ga: "",
		};
	}

	componentDidMount() {
		this.getPublicData();
		this.props.getLoggedinUser();
		this.getTitle();
	}

	getPublicData = async () => {
		if (isMobileOnly) {
			window.conectionType = "MOBILE";
		} else if (isTablet) {
			window.conectionType = "TABLET";
		} else if (isSmartTV) {
			window.conectionType = "SMART TV";
		} else {
			window.conectionType = "DESKTOP";
		}
		try {
			const resp = await publicIpApi();
			const response = await geoIpApi(resp.ip);
			window.flagIcon = response.location.country.flag.emojitwo;
			window.city = response.location.city;
			window.postalCode = response.location.postal;
			window.continent = response.location.continent.name;
			window.continentCode = response.location.continent.code;
			window.country = response.location.country.name;
			window.countryIsoCode = response.location.country.code;
			window.locationLatLong = `${response.location.latitude},${response.location.longitude}`;
			window.accuracyRadius = response.location.country.area;
			window.timeZone = response.time_zone.id;
			window.region = response.location.region.name;
			window.regionIsoCode = response.location.region.code;
			window.ipAddress = response.ip;
			window.ipType = response.type;
			window.isp = response.connection.organization;
		} catch (error) {
			console.log(error);
		}
		this.userSocket();
	};

	getTitle = async () => {
		const resp = await getEventOptionsApi();
		if (resp.ok) {
			this.setState({
				...this.state,
				title: resp.optionsEvent.title,
				description: resp.optionsEvent.description,
				ga: resp.optionsEvent.ga,
				favicon: `${basePath}/${apiVersion}/event-options-image/${resp.optionsEvent.favicon}`,
			});
		}
	};

	userSocket = () => {
		const interval = setInterval(() => {
			const token = getAccessTokenApi();
			if (token !== null) {
				const decodedToken = jwtDecode(token);
				if (decodedToken) {
					let name;
                    if (decodedToken.name && decodedToken.name.length > 0) {
                        name = decodedToken.name;
                    }
                    if (decodedToken.lastname && decodedToken.lastname.length > 0) {
                        name = name + " " + decodedToken.lastname;
                    }
                    if (decodedToken.fullName && decodedToken.fullName.length > 0) {
                        name = decodedToken.fullName;
                    }
					const newUser = {
						userId: decodedToken.id,
						name: name,
						email: decodedToken.email,
						route: window.location.pathname,
						flagIcon: window.flagIcon,
						city: window.city,
						postalCode: window.postalCode,
						continent: window.continent,
						continentCode: window.continentCode,
						country: window.country,
						countryIsoCode: window.countryIsoCode,
						locationLatLong: window.locationLatLong,
						accuracyRadius: window.accuracyRadius,
						timeZone: window.timeZone,
						region: window.region,
						regionIsoCode: window.regionIsoCode,
						ipAddress: window.ipAddress,
						ipType: window.ipType,
						isp: window.isp,
						conectionType: window.conectionType,
						navigatorName: `${browserName} ${browserVersion} (full version. ${fullBrowserVersion})`,
						operatingSystem: `${osName} ${osVersion}`,
					};
					Socket.emit("NEW_USER", newUser);
					clearInterval(interval);
				}
			}
		}, 5000);
	};

	render() {
		return (
			<>
				<Helmet>
					<title>{this.state.title}</title>
					<meta name="description" content={this.state.description} />
  					<link rel="icon" type="image/png" href={this.state.favicon} sizes="16x16" />
					<link rel="icon" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="57x57" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="60x60" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="72x72" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="76x76" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="114x114" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="120x120" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="144x144" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="152x152" href={this.state.favicon} />
					<link rel="apple-touch-icon" sizes="180x180" href={this.state.favicon} />
					<link rel="icon" type="image/png" sizes="192x192"  href={this.state.favicon} />
					<link rel="icon" type="image/png" sizes="32x32" href={this.state.favicon} />
					<link rel="icon" type="image/png" sizes="96x96" href={this.state.favicon} />
					<link rel="icon" type="image/png" sizes="16x16" href={this.state.favicon} />
					<meta property="og:title" content={this.state.title} />
					<meta property="og:image" content={this.state.favicon} />
					<meta property="og:description" content={this.state.description} />
					{/* Global site tag (gtag.js) - Google Analytics */}
					{this.state.ga ? (
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${
								this.state.ga
							}`}
						/>
					) : null}
					{this.state.ga ? (
						<script>
							{`window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
							
								gtag('config', '${this.state.ga}');
							`}
						</script>
					) : null}
				</Helmet>
				<AuthProvider>
					<Router>
						<Switch>
							{routes.map((route, index) => (
								<RouteWithSubRoutes key={index} {...route} />
							))}
						</Switch>
					</Router>
				</AuthProvider>
				<BackTop />
			</>
		);
	}
}

function RouteWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => (
				<route.component routes={route.routes} {...props} />
			)}
		/>
	);
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getLoggedinUser: () => dispatch(actions.authCheckState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
