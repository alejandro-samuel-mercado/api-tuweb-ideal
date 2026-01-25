const prisma = require("../config/prisma");

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

exports.createReview = async (req, res) => {
  const { name, rating, comment, approved } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        name,
        rating: parseInt(rating),
        comment,
        approved: approved !== undefined ? approved : false,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error creating review" });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { approved },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error updating review" });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review" });
  }
};
