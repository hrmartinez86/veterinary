const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ACCESS_TOKEN_TTL = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_COOKIE_NAME = 'vet_refresh_token';

function durationToMs(duration) {
  if (typeof duration === 'number') return duration;

  const match = /^([0-9]+)([smhd])$/i.exec(String(duration).trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const factors = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return value * factors[unit];
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

function issueAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role, mustChangePassword: Boolean(user.mustChangePassword) },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function issueRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/auth',
    maxAge: durationToMs(REFRESH_TOKEN_TTL),
  };
}

function readRefreshToken(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.split(';').reduce((token, part) => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (rawKey === REFRESH_COOKIE_NAME) {
      return decodeURIComponent(rawValue.join('='));
    }
    return token;
  }, null);
}

function issueSession(res, user) {
  const accessToken = issueAccessToken(user);
  const refreshToken = issueRefreshToken(user);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());

  return {
    user: sanitizeUser(user),
    accessToken,
    expiresIn: ACCESS_TOKEN_TTL,
  };
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json(issueSession(res, user));
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = readRefreshToken(req);
    if (!refreshToken) {
      return res.status(401).json({ error: 'Sesión no válida' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Sesión no válida' });
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Sesión no válida' });
    }

    res.json(issueSession(res, user));
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

exports.logout = async (_req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  res.json({ message: 'Sesión cerrada' });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword, currentPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    const freshUser = await User.findByPk(req.user.id);
    if (!freshUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (!freshUser.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Se requiere la contraseña actual' });
      }
      const valid = await bcrypt.compare(currentPassword, freshUser.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await freshUser.update({ passwordHash, mustChangePassword: false });

    res.json(issueSession(res, { ...freshUser.toJSON(), mustChangePassword: false }));
  } catch (error) {
    next(error);
  }
};

exports.ensureDefaultAdmin = async () => {
  const userCount = await User.count();
  if (userCount > 0) return;

  const name = process.env.ADMIN_NAME || 'VetCare Admin';
  const email = (process.env.ADMIN_EMAIL || 'admin@vetcare.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'VetCare123!';
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({ name, email, passwordHash, role: 'admin', mustChangePassword: false });
  console.log(`Usuario admin inicial creado: ${email}`);
};