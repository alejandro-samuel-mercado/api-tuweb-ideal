const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/personal-data", settingsController.getPersonalData);
router.put("/personal-data", adminMiddleware, settingsController.updatePersonalData);

module.exports = router;
