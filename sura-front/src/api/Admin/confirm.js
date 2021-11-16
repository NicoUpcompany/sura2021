import { basePath, apiVersion } from "../config";

export function postConfirmApi(token, data) {
	const url = `${basePath}/${apiVersion}/confirm`;
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

export function putConfirmApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/confirm/${id}`;
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

export function putUploadLogoApi(token, image, id) {
	const url = `${basePath}/${apiVersion}/confirm-logo/${id}`;

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

export function putUploadBackgroundApi(token, image, id) {
	const url = `${basePath}/${apiVersion}/confirm-background/${id}`;

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

export function getConfirmImageApi(image) {
	const url = `${basePath}/${apiVersion}/confirm-image/${image}`;

	return fetch(url)
		.then((response) => {
			return response.url;
		})
		.catch((err) => {
			return err.message;
		});
}

export function getConfirmApi() {
	const url = `${basePath}/${apiVersion}/confirm`;
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
