import { basePath, apiVersion } from "../config";

export function postTalkApi(token, data) {
	const url = `${basePath}/${apiVersion}/talk`;
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

export function putTalkApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/talk/${id}`;
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

export function getTalkApi(token, agenda) {
	const url = `${basePath}/${apiVersion}/talk/${agenda}`;
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

export function getAllTalkApi(token) {
	const url = `${basePath}/${apiVersion}/talk`;
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

export function deleteTalkApi(token, id) {
	const url = `${basePath}/${apiVersion}/talk/${id}`;
	const params = {
		method: "DELETE",
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
