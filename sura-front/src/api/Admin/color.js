import { basePath, apiVersion } from "../config";

export function postColorsApi(token, data) {
	const url = `${basePath}/${apiVersion}/colors`;
	const params = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
            Authorization: token
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

export function putColorsApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/colors/${id}`;
	const params = {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
            Authorization: token
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

export function getColorsApi() {
	const url = `${basePath}/${apiVersion}/colors`;
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
