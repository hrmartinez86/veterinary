const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub, {
      attributes: ['id', 'name', 'email', 'role', 'mustChangePassword'],
    });

    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};