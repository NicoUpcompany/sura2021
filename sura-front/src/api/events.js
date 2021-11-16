import { basePath, apiVersion } from './config';

export function getEventsApi(token) {
    const url = `${basePath}/${apiVersion}/event`;

    const params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

export function eventApi(data) {
    const url = `${basePath}/${apiVersion}/event`;

    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

export function publicIpApi() {
    const url = '//api.ipify.org?format=json';

    return fetch(url)
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data
        }).catch(() => {
            return 'Error';
        })
}
