const prisma = require("../config/prisma");

exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: "asc" },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans" });
  }
};

exports.createPlan = async (req, res) => {
  const {
    name,
    slug,
    tagline,
    description,
    detailedDescription,
    price,
    setupPrice,
    monthlyPrice,
    price_detail,
    features,
    whatYouGet,
    useCases,
    management,
    considerations,
    recommendations,
    demos,
    popular,
  } = req.body;
  try {
    const plan = await prisma.plan.create({
      data: {
        name,
        slug,
        tagline,
        tagline_en: req.body.tagline_en,
        description,
        description_en: req.body.description_en,
        detailedDescription,
        detailedDescription_en: req.body.detailedDescription_en,
        price: parseFloat(price) || 0,
        setupPrice: parseFloat(setupPrice) || parseFloat(price) || 0,
        monthlyPrice: parseFloat(monthlyPrice) || 0,
        price_detail,
        features,
        whatYouGet,
        useCases,
        management,
        considerations,
        recommendations,
        demos,
        popular,
      },
    });
    res.status(201).json(plan);
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Error creating plan" });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    tagline,
    description,
    detailedDescription,
    price,
    setupPrice,
    monthlyPrice,
    price_detail,
    features,
    whatYouGet,
    useCases,
    management,
    considerations,
    recommendations,
    demos,
    popular,
  } = req.body;
  try {
    const plan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        tagline,
        tagline_en: req.body.tagline_en,
        description,
        description_en: req.body.description_en,
        detailedDescription,
        detailedDescription_en: req.body.detailedDescription_en,
        price: parseFloat(price) || 0,
        setupPrice: parseFloat(setupPrice) || parseFloat(price) || 0,
        monthlyPrice: parseFloat(monthlyPrice) || 0,
        price_detail,
        features,
        whatYouGet,
        useCases,
        management,
        considerations,
        recommendations,
        demos,
        popular,
      },
    });
    res.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Error updating plan" });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.plan.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plan" });
  }
};

exports.getExampleProjects = async (req, res) => {
  try {
    const projects = await prisma.exampleProject.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching example projects" });
  }
};

exports.createExampleProject = async (req, res) => {
  const {
    title,
    slug,
    tagline,
    description,
    detailedDescription,
    imageUrl,
    category,
    url,
    features,
    technologies,
    client,
    completionDate,
    testimonial,
    gallery,
  } = req.body;
  try {
    const project = await prisma.exampleProject.create({
      data: {
        title,
        slug,
        tagline,
        tagline_en: req.body.tagline_en,
        description,
        description_en: req.body.description_en,
        detailedDescription,
        detailedDescription_en: req.body.detailedDescription_en,
        imageUrl,
        category,
        url,
        features,
        technologies,
        client,
        completionDate,
        testimonial,
        gallery,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating example project" });
  }
};

exports.updateExampleProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    tagline,
    description,
    detailedDescription,
    imageUrl,
    category,
    url,
    features,
    technologies,
    client,
    completionDate,
    testimonial,
    gallery,
  } = req.body;
  try {
    const project = await prisma.exampleProject.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        tagline,
        tagline_en: req.body.tagline_en,
        description,
        description_en: req.body.description_en,
        detailedDescription,
        detailedDescription_en: req.body.detailedDescription_en,
        imageUrl,
        category,
        url,
        features,
        technologies,
        client,
        completionDate,
        testimonial,
        gallery,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating example project" });
  }
};

exports.deleteExampleProject = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.exampleProject.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Example project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting example project" });
  }
};
