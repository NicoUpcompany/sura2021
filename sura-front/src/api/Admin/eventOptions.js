import { basePath, apiVersion } from "../config";

export function postEventOptionsApi(token, data) {
	const url = `${basePath}/${apiVersion}/event-options`;
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

export function putEventOptionsApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/event-options/${id}`;
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

export function getEventOptionsApi() {
	const url = `${basePath}/${apiVersion}/event-options`;
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

export function putUploadFaviconApi(token, image, id) {
	const url = `${basePath}/${apiVersion}//event-options-image/${id}`;

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

export function getEventOptionFaviconApi(image) {
	const url = `${basePath}/${apiVersion}/event-options-image/${image}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}
