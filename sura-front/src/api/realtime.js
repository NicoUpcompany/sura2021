import { basePath, apiVersion } from "./config";

export function getRealTimeDataApi() {
	const url = `${basePath}/${apiVersion}/real-time`;

	const params = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};

	return fetch(url, params)
		.then((resp) => {
			return resp.json();
		})
		.then((result) => {
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}

export function publicIpApi() {
	const url = "//api.ipify.org?format=json";

	return fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			return data;
		})
		.catch(() => {
			return "Error";
		});
}

export function geoIpApi(ip) {
	const url = `https://api.ipregistry.co/${ip}?key=zogurvz77psm1t`;

	return fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			return data;
		})
		.catch(() => {
			return "Error";
		});
}
