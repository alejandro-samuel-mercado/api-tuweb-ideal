const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get("/personal-data", settingsController.getPersonalData);
router.put("/personal-data", settingsController.updatePersonalData);

module.exports = router;
