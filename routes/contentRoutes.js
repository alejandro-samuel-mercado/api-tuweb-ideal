const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.get("/plans", contentController.getPlans);
router.get("/example-projects", contentController.getExampleProjects);

router.post("/plans", contentController.createPlan);
router.put("/plans/:id", contentController.updatePlan);
router.delete("/plans/:id", contentController.deletePlan);

router.post(
  "/example-projects",

  contentController.createExampleProject
);
router.put("/example-projects/:id", contentController.updateExampleProject);
router.delete(
  "/example-projects/:id",

  contentController.deleteExampleProject
);

module.exports = router;
