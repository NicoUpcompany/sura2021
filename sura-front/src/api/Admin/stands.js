import { basePath, apiVersion } from "../config";

export function postStandApi(token, data) {
	const url = `${basePath}/${apiVersion}/stand`;
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

export function putStandApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/stand/${id}`;
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

export function getStandApi(token) {
	const url = `${basePath}/${apiVersion}/stand`;
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

export function deleteStandApi(token, id) {
	const url = `${basePath}/${apiVersion}/stand/${id}`;
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

export function putUploadImageApi(token, image, id, tipo) {
	const url = `${basePath}/${apiVersion}/stand-image/${id}`;

	const formData = new FormData();
	formData.append("image", image, image.name);
	formData.append("imgType", tipo);

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

export function getStandImageApi(image) {
	const url = `${basePath}/${apiVersion}/stand-image/${image}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}
