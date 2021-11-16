import { basePath, apiVersion } from "../config";

export function postWaitingRoomApi(token, data) {
	const url = `${basePath}/${apiVersion}/waitingroom`;
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

export function putWaitingRoomApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/waitingroom/${id}`;
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

export function putUploadHeaderApi(token, image, id) {
	const url = `${basePath}/${apiVersion}/waitingroom-header/${id}`;

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

export function putUploadLogoApi(token, image, id) {
	const url = `${basePath}/${apiVersion}/waitingroom-logo/${id}`;

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

export function getWaitingRoomImageApi(image) {
	const url = `${basePath}/${apiVersion}/waitingroom-image/${image}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}

export function getWaitingRoomApi(token) {
	const url = `${basePath}/${apiVersion}/waitingroom`;
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
