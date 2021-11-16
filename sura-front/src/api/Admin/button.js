import { basePath, apiVersion } from "../config";

export function postButtonApi(token, data) {
	const url = `${basePath}/${apiVersion}/button`;
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

export function putButtonApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/button/${id}`;
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

export function getButtonApi(token, stand) {
	const url = `${basePath}/${apiVersion}/button/${stand}`;
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

export function deleteButtonApi(token, id) {
	const url = `${basePath}/${apiVersion}/button/${id}`;
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

export function putUploadFileApi(token, file, id) {
	const url = `${basePath}/${apiVersion}/button-file/${id}`;
	console.log(url);

	const formData = new FormData();
	formData.append("file", file, file.name);

	const params = {
		method: "PUT",
		body: formData,
		headers: {
			Authorization: token,
		},
	};

	return fetch(url, params)
		.then((response) => {
			return response.json();
		})
		.then((result) => {
			console.log(result);
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}

export function getButtonFileApi(file) {
	const url = `${basePath}/${apiVersion}/button-file/${file}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}
