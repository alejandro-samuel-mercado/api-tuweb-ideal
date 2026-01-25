const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(adminMiddleware);

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

router.get("/orders", adminController.getAllOrders);
router.get("/orders/:id", adminController.getOrderById);
router.put("/orders/:id", adminController.updateOrder);
router.delete("/orders/:id", adminController.deleteOrder);

router.put("/projects/:orderId", adminController.updateProject);

router.get("/plans", adminController.getPlans);
router.post("/plans", adminController.createPlan);
router.put("/plans/:id", adminController.updatePlan);

module.exports = router;
