import { basePath, apiVersion } from "../config";

export function postExpositorApi(token, data) {
	const url = `${basePath}/${apiVersion}/expositor`;
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

export function putExpositorApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/expositor/${id}`;
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

export function getExpositorApi(token, agenda) {
	const url = `${basePath}/${apiVersion}/expositor/${agenda}`;
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

export function getAllExpositorApi(token) {
	const url = `${basePath}/${apiVersion}/expositor`;
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

export function deleteExpositorApi(token, id) {
	const url = `${basePath}/${apiVersion}/expositor/${id}`;
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

export function putUploadImageApi(token, image, id) {
	const url = `${basePath}/${apiVersion}/expositor-image/${id}`;

	const formData = new FormData();
	formData.append("image", image, image.name);

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
			return result;
		})
		.catch((err) => {
			return err.message;
		});
}

export function getExpositorImageApi(image) {
	const url = `${basePath}/${apiVersion}/expositor-image/${image}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}
