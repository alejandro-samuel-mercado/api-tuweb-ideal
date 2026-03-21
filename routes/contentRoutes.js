const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/plans", contentController.getPlans);
router.post("/plans", adminMiddleware, contentController.createPlan);
router.put("/plans/:id", adminMiddleware, contentController.updatePlan);
router.delete("/plans/:id", adminMiddleware, contentController.deletePlan);

// Example Projects Routes
router.get("/example-projects", contentController.getExampleProjects);
router.post("/example-projects", adminMiddleware, contentController.createExampleProject);
router.put("/example-projects/:id", adminMiddleware, contentController.updateExampleProject);
router.delete("/example-projects/:id", adminMiddleware, contentController.deleteExampleProject);

// Alias for frontend compatibility
router.get("/projects", contentController.getExampleProjects);
router.post("/projects", adminMiddleware, contentController.createExampleProject);
router.put("/projects/:id", adminMiddleware, contentController.updateExampleProject);
router.delete("/projects/:id", adminMiddleware, contentController.deleteExampleProject);

module.exports = router;
