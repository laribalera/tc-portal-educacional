function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Acesso negado." });
    }
    next();
  };
}

module.exports = { requireRole };
