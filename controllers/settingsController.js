const prisma = require("../config/prisma");

exports.getPersonalData = async (req, res) => {
  try {
    let data = await prisma.personalData.findFirst();
    if (!data) {
      data = await prisma.personalData.create({
        data: {
          email: "alesamu.am@gmail.com",
          phone: "+54 388 3118692",
          address: "",
          city: "Jujuy",
          country: "Argentina",
        },
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching personal data" });
  }
};

exports.updatePersonalData = async (req, res) => {
  const { email, phone, address, city, country } = req.body;
  try {
    const first = await prisma.personalData.findFirst();
    let data;
    if (first) {
      data = await prisma.personalData.update({
        where: { id: first.id },
        data: { email, phone, address, city, country },
      });
    } else {
      data = await prisma.personalData.create({
        data: { email, phone, address, city, country },
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating personal data" });
  }
};
