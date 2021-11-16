import { basePath, apiVersion } from './config';

export function getUserAgengaApi(token) {
    const url = `${basePath}/${apiVersion}/user-agenda`;

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