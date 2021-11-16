import { basePath, apiVersion } from "../config";

export function postAgendaStandApi(token, data) {
	const url = `${basePath}/${apiVersion}/agenda-stand`;
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

export function putAgendaStandApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/agenda-stand/${id}`;
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

export function getAgendaStandApi(token, button) {
	const url = `${basePath}/${apiVersion}/agenda-stand/${button}`;
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

export function getAgendaStandByDayApi(token, data) {
	const url = `${basePath}/${apiVersion}/agenda-day`;
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

export function getAgendaStandByOwnerApi(token, data) {
	const url = `${basePath}/${apiVersion}/agenda-owner`;
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

export function deleteAgendaStandApi(token, id) {
	const url = `${basePath}/${apiVersion}/agenda-stand/${id}`;
	const params = {
		method: "DELETE",
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

export function putChangeStatusApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/change-agenda-status/${id}`;
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
