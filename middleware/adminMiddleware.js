module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    return next();
  }
  res
    .status(403)
    .json({
      message: "Acceso denegado. Se requieren privilegios de administrador.",
    });
};
