const nodemailer = require("nodemailer");
const prisma = require("../config/prisma");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const personalData = await prisma.personalData.findFirst();
    const adminEmail =
      personalData?.email || process.env.ADMIN_EMAIL || "admin@example.com";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      replyTo: email,
      subject: `Nuevo Mensaje de Contacto: ${name}`,
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || "No especificado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};
