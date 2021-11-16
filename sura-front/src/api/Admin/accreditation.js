import { basePath, apiVersion } from "../config";

export function postAccreditationApi(token, data) {
	const url = `${basePath}/${apiVersion}/accreditation`;
	const params = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
            Authorization: token,
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

export function putAccreditationApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/accreditation/${id}`;
	const params = {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
            Authorization: token,
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

export function getAccreditationApi(token) {
	const url = `${basePath}/${apiVersion}/accreditation`;
	const params = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
            Authorization: token,
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
