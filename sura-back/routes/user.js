const express = require("express");
const UserController = require("../controllers/user");

const md_auth = require("../middleware/authenticated");

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);

api.post("/sign-in-admin", UserController.signInAdmin);

api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.put("/update-waiting-room-time", [md_auth.ensureAuth], UserController.updateWaitingRoomTime);
api.put("/update-stream-time", [md_auth.ensureAuth], UserController.updateStreamTime);
api.put("/change-role/:id", [md_auth.ensureAuth], UserController.changeRole);
api.put("/user/:id", [md_auth.ensureAuth], UserController.updateUser);
api.delete("/user/:id", [md_auth.ensureAuth], UserController.deleteUser);

module.exports = api;