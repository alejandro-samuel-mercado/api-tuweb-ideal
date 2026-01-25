const bcrypt = require('bcryptjs');
const passport = require('passport');
const prisma = require('../config/prisma');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT'
      }
    });

    req.login(user, (err) => {
      if (err) throw err;
      res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error al cerrar sesión' });
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
};

exports.currentUser = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
