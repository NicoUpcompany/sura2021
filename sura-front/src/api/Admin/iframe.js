import { basePath, apiVersion } from "../config";

export function postIframeApi(token, data) {
	const url = `${basePath}/${apiVersion}/iframe`;
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

export function putIframeApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/iframe/${id}`;
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

export function getIframeApi(token) {
	const url = `${basePath}/${apiVersion}/iframe`;
	const params = {
		method: "GET",
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
