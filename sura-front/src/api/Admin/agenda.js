import { basePath, apiVersion } from "../config";

export function postAgendaApi(token, data) {
	const url = `${basePath}/${apiVersion}/admin-agenda`;
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

export function putAgendaApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/admin-agenda/${id}`;
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

export function getAgendaApi(token) {
	const url = `${basePath}/${apiVersion}/admin-agenda`;
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

export function getAgendaClientApi(token) {
	const url = `${basePath}/${apiVersion}/client-agenda`;
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

export function deleteAgendaApi(token, id) {
	const url = `${basePath}/${apiVersion}/admin-agenda/${id}`;
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
