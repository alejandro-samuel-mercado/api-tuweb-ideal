const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.get("/plans", contentController.getPlans);
// Example Projects Routes
router.get("/example-projects", contentController.getExampleProjects);
router.post("/example-projects", contentController.createExampleProject);
router.put("/example-projects/:id", contentController.updateExampleProject);
router.delete("/example-projects/:id", contentController.deleteExampleProject);

// Alias for frontend compatibility
router.get("/projects", contentController.getExampleProjects);
router.post("/projects", contentController.createExampleProject);
router.put("/projects/:id", contentController.updateExampleProject);
router.delete("/projects/:id", contentController.deleteExampleProject);

module.exports = router;
