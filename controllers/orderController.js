const prisma = require("../config/prisma");



exports.createOrder = async (req, res) => {
  const plan = req.body.plan;
  const discountCode = req.body.discountCode;
  const userId = req.user.id;

  let requirements = req.body.requirements;
  if (typeof requirements === "string") {
    try {
      requirements = JSON.parse(requirements);
    } catch (e) {
      console.error("Error parsing requirements:", e);
      requirements = {};
    }
  }

  try {
    const planDb = await prisma.plan.findUnique({ where: { slug: plan } });
    if (!planDb) {
      return res.status(404).json({ message: "Plan no encontrado en la base de datos" });
    }

    let finalPrice = planDb.price || 0;
    let appliedCode = null;

    if (discountCode) {
      const codeData = await prisma.discountCode.findUnique({
        where: { code: discountCode, isActive: true },
      });

      if (codeData) {
        finalPrice = finalPrice * (1 - codeData.percentage / 100);
        appliedCode = discountCode;
      }
    }

    const referenceImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
referenceImages.push(file.path);
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        plan,
        requirements,
        referenceImages: referenceImages.length > 0 ? referenceImages : null,
        price: finalPrice,
        discountCode: appliedCode,
        status: "PENDING",
        timeline: {
          steps: [
            { title: "Pedido Recibido", status: "completed", date: new Date() },
            { title: "Revisión", status: "current", date: null },
            { title: "Pago", status: "pending", date: null },
            { title: "Desarrollo", status: "pending", date: null },
            { title: "Entrega", status: "pending", date: null },
          ],
        },
      },
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  console.log(`Fetching orders for user ID: ${userId}`);

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
      },
    });

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
        project: true,
      },
    });

    if (!order)
      return res.status(404).json({ message: "Pedido no encontrado" });
    if (order.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
};

exports.addMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;
const imageUrl = req.file ? req.file.path : null;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });
    if (!order)
      return res.status(404).json({ message: "Pedido no encontrado" });

    if (order.userId !== senderId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const message = await prisma.message.create({
      data: {
        content: content || "",
        imageUrl,
        senderId,
        orderId: parseInt(id),
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (order.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (order.status !== "PENDING" && req.user.role !== "ADMIN") {
      return res.status(400).json({
        message: "Solo se pueden eliminar pedidos pendientes",
      });
    }

    await prisma.$transaction([
      prisma.message.deleteMany({ where: { orderId: parseInt(id) } }),
      prisma.project.deleteMany({ where: { orderId: parseInt(id) } }),
      prisma.order.delete({ where: { id: parseInt(id) } }),
    ]);

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el pedido" });
  }
};
