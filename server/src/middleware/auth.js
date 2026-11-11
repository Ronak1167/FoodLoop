import jwt from 'jsonwebtoken';
import { Users } from '../db/storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'foodloop_super_secret_jwt_key_2026_sdg12_sustainable';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await Users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User no longer exists.' });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid', error: err.message });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'.`
      });
    }
    next();
  };
}
