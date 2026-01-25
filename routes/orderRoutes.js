const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "No autenticado" });
};

const upload = require("../middleware/upload");

router.use(isAuthenticated);

router.post(
  "/",
  upload.array("referenceImages", 5),
  orderController.createOrder
);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.delete("/:id", orderController.deleteOrder);
router.post(
  "/:id/messages",
  upload.single("image"),
  orderController.addMessage
);

module.exports = router;
