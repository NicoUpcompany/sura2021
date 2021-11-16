import { basePath, apiVersion } from "../config";

export function postAddNewAppApi(data, token) {
    const accessToken = `Bearer ${token}`;
	const url = "https://apimgmt.cometchat.io/apps";
	const params = {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			Authorization: accessToken,
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

export function postLoginApi(data) {
	const url = "https://apimgmt.cometchat.io/login";
	const params = {
		method: "POST",
		body: JSON.stringify(data),
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

export function deleteUserChatApi(uid, appId, apiKey) {
	const url = `https://api-us.cometchat.io/v2.0/users/${uid}`;
	const params = {
		method: "DELETE",
		headers: {
			appId: appId,
			apiKey: apiKey,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
  		body: JSON.stringify({permanent: true}),
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

export function deleteGroupChatApi(guid, appId, apiKey) {
	const url = `https://api-us.cometchat.io/v2.0/groups/${guid}`;
	const params = {
		method: "DELETE",
		headers: {
			appId: appId,
			apiKey: apiKey,
			'Content-Type': 'application/json',
			Accept: 'application/json',
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

export function postGroupChatApi(data, appId, apiKey) {
	const url = `https://api-us.cometchat.io/v2.0/groups`;
	const params = {
		method: "POST",
		headers: {
			appId: appId,
			apiKey: apiKey,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(data),
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

export function postNetworkingApi(token, data) {
	const url = `${basePath}/${apiVersion}/networking`;
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

export function putNetworkingApi(token, data, id) {
	const url = `${basePath}/${apiVersion}/networking/${id}`;
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

export function getNetworkingApi() {
	const url = `${basePath}/${apiVersion}/networking`;
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
