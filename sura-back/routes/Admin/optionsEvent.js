const express = require("express");
const multiParty = require("connect-multiparty");
const OptionsEventController = require("../../controllers/Admin/optionsEvent");

const md_auth = require("../../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/optionsevent" });

const api = express.Router();

api.get("/event-options", OptionsEventController.getOptionsEvent);
api.post("/event-options", [md_auth.ensureAuth], OptionsEventController.saveOptionsEvent);
api.put("/event-options/:id", [md_auth.ensureAuth], OptionsEventController.updateOptionsEvent);
api.put("/event-options-image/:id", [md_upload_avatar], OptionsEventController.uploadFavicon);
api.get("/event-options-image/:image", OptionsEventController.getFavicon);

module.exports = api;
