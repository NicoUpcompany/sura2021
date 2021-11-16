import { basePath, apiVersion } from "../config";

export function postPollApi(token, data) {
	const url = `${basePath}/${apiVersion}/poll`;
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

export function getQuestionApi(token) {
	const url = `${basePath}/${apiVersion}/question-poll`;
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

export function putQuestionApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/question-poll/${id}`;
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

export function deleteQuestionApi(token, id) {
	const url = `${basePath}/${apiVersion}/question-poll/${id}`;
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

export function postPollOptionApi(token, data) {
	const url = `${basePath}/${apiVersion}/option`;
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

export function getPollOptionApi(token, id) {
	const url = `${basePath}/${apiVersion}/option/${id}`;
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

export function putPollOptionApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/option/${id}`;
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

export function deletePollOptionpi(token, id) {
	const url = `${basePath}/${apiVersion}/option/${id}`;
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

export function getFullPollApi(token, id) {
	const url = `${basePath}/${apiVersion}/full-poll/${id}`;
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

export function postPollAnswerApi(token, data) {
	const url = `${basePath}/${apiVersion}/answer`;
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
			console.log(result);
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}

export function getPollAdminApi(token) {
	const url = `${basePath}/${apiVersion}/full-poll`;
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

export function getAnswerApi(token) {
	const url = `${basePath}/${apiVersion}/answer`;
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
