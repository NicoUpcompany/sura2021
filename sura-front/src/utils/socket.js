import io from "socket.io-client";
const Socket = io("http://localhost:8080/");
// const Socket = io("https://cms.upwebinar.cl/");
// const Socket = io("https://cognitiva.upwebinar.cl/");

export default Socket;
