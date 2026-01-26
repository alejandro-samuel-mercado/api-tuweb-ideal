const prisma = require("../config/prisma");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: "CLIENT" } });
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { status: "FINISHED" },
      _sum: { price: true },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 11); 

    const monthlySales = await prisma.order.findMany({
      where: {
        status: "FINISHED",
        updatedAt: {
          gte: sevenMonthsAgo,
        },
      },
      select: {
        price: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    const salesByMonth = monthlySales.reduce((acc, order) => {
      const month = order.updatedAt.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + order.price;
      return acc;
    }, {});
    
    const salesChartData = Object.entries(salesByMonth).map(([key, value]) => ({
      name: key,
      value,
    }));


    res.json({
      totalUsers,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.price || 0,
      ordersByStatus,
      salesChartData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

exports.getUsers = async (req, res) => {
  const { search } = req.query;
  let where = { role: "CLIENT" };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: {
            id: true,
            plan: true,
            status: true,
            price: true,
            discountCode: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  const { name, email, role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: parsedId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(400).json({ message: "El email ya está en uso" });
    }
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const deleteMessages = prisma.message.deleteMany({
      where: { senderId: parsedId },
    });
    const deleteOrders = prisma.order.deleteMany({
      where: { userId: parsedId },
    });
    const deleteUser = prisma.user.delete({ where: { id: parsedId } });

    await prisma.$transaction([deleteMessages, deleteOrders, deleteUser]);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    const order = await prisma.order.findUnique({
      where: { id: parsedId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        project: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (!order.user) {
        order.user = { name: 'Usuario Eliminado', email: 'N/A', id: 0 };
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  const { status, timeline, deliveryDate } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parsedId },
      data: {
        status,
        timeline,
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
      },
    });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar pedido" });
  }
};

exports.updateProject = async (req, res) => {
  const { orderId } = req.params;
  const parsedOrderId = parseInt(orderId);
  if (isNaN(parsedOrderId)) return res.status(400).json({ message: "Invalid Order ID" });

  const {
    url,
    adminPanelUrl,
    documentationUrl,
    description,
    name,
    adminUsername,
    adminPassword,
  } = req.body;

  try {
    const project = await prisma.project.upsert({
      where: { orderId: parsedOrderId },
      update: {
        url,
        adminPanelUrl,
        documentationUrl,
        description,
        name,
        adminUsername,
        adminPassword,
      },
      create: {
        orderId: parsedOrderId,
        url,
        adminPanelUrl,
        documentationUrl,
        description,
        name,
        adminUsername,
        adminPassword,
      },
    });

    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar proyecto" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    res.json({ plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener planes" });
  }
};

exports.updatePlan = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  const data = req.body;

  try {
    const plan = await prisma.plan.update({
      where: { id: parsedId },
      data,
    });
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar plan" });
  }
};

exports.createPlan = async (req, res) => {
  const data = req.body;
  try {
    const plan = await prisma.plan.create({ data });
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear plan" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid ID" });

  try {
    await prisma.$transaction([
      prisma.message.deleteMany({ where: { orderId: parsedId } }),
      prisma.project.deleteMany({ where: { orderId: parsedId } }),
      prisma.order.delete({ where: { id: parsedId } }),
    ]);
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar pedido" });
  }
};
