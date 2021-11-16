import { basePath, apiVersion } from './config';

export function getTime(){
    const url = `${basePath}/${apiVersion}/time`;

    const params = {
        method: "GET",
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