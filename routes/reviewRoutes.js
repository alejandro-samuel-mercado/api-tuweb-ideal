const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", reviewController.getApprovedReviews);
router.post("/", reviewController.createReview);

router.get("/all", adminMiddleware, reviewController.getAllReviews);
router.put("/:id", adminMiddleware, reviewController.updateReview);
router.delete("/:id", adminMiddleware, reviewController.deleteReview);

module.exports = router;
