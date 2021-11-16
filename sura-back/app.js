const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

// Basic
//#region
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const realTimeRoutes = require("./routes/realTime");
const questionRoutes = require("./routes/question");
const userAgendaRoutes = require("./routes/userAgenda");
//#endregion

// Admin
//#region
const adminIframeRoutes = require("./routes/Admin/iframe");
const adminChronometerRoutes = require("./routes/Admin/chronometer");
const adminAccreditationRoutes = require("./routes/Admin/accreditation");
const adminColorRoutes = require("./routes/Admin/color");
const adminSignUpRoutes = require("./routes/Admin/signUp");
const adminOptionsEventRoutes = require("./routes/Admin/optionsEvent");
const adminConfirmRoutes = require("./routes/Admin/confirm");
const adminSignInRoutes = require("./routes/Admin/signIn");
const adminAgendaRoutes = require("./routes/Admin/agenda");
const adminTalkRoutes = require("./routes/Admin/talk");
const adminExpositorRoutes = require("./routes/Admin/expositor");
const adminStandRoutes = require("./routes/Admin/stand");
const adminButtonRoutes = require("./routes/Admin/button");
const adminAgendaStandRoutes = require("./routes/Admin/agendaStand");
const adminWaitingRoomRoutes = require("./routes/Admin/waitingRoom");
const adminStreamingRoutes = require("./routes/Admin/streaming");
const adminNetworkingRoutes = require("./routes/Admin/networking");
const adminPollRoutes = require("./routes/Admin/poll");
//#endregion

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
// app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
	next();
});

// Basic
//#region
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, eventRoutes);
app.use(`/api/${API_VERSION}`, realTimeRoutes);
app.use(`/api/${API_VERSION}`, questionRoutes);
app.use(`/api/${API_VERSION}`, userAgendaRoutes);
//#endregion

// Admin
//#region
app.use(`/api/${API_VERSION}`, adminIframeRoutes);
app.use(`/api/${API_VERSION}`, adminChronometerRoutes);
app.use(`/api/${API_VERSION}`, adminAccreditationRoutes);
app.use(`/api/${API_VERSION}`, adminColorRoutes);
app.use(`/api/${API_VERSION}`, adminSignUpRoutes);
app.use(`/api/${API_VERSION}`, adminOptionsEventRoutes);
app.use(`/api/${API_VERSION}`, adminConfirmRoutes);
app.use(`/api/${API_VERSION}`, adminSignInRoutes);
app.use(`/api/${API_VERSION}`, adminAgendaRoutes);
app.use(`/api/${API_VERSION}`, adminTalkRoutes);
app.use(`/api/${API_VERSION}`, adminExpositorRoutes);
app.use(`/api/${API_VERSION}`, adminStandRoutes);
app.use(`/api/${API_VERSION}`, adminButtonRoutes);
app.use(`/api/${API_VERSION}`, adminAgendaStandRoutes);
app.use(`/api/${API_VERSION}`, adminWaitingRoomRoutes);
app.use(`/api/${API_VERSION}`, adminStreamingRoutes);
app.use(`/api/${API_VERSION}`, adminNetworkingRoutes);
app.use(`/api/${API_VERSION}`, adminPollRoutes);
//#endregion

module.exports = app;
