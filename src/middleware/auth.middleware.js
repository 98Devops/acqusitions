import logger from '#config/logger.js';
import { jwttoken } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';

export const authenticationToken = (req, res, next) => {
  try {
    const token =
      cookies.get(req, 'token') ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token)
      return res.status(401).json({ message: 'Authentication token missing' });

    const payload = jwttoken.verify(token);
    req.user = {
      id: typeof payload.id === 'string' ? Number(payload.id) : payload.id,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (e) {
    logger.warn('Invalid authentication token', e);
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const requireRole = allowedRole => (req, res, next) => {
  try {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: 'Unauthorized' });

    if (Array.isArray(allowedRole)) {
      if (!allowedRole.includes(role))
        return res.status(403).json({ message: 'Forbidden' });
    } else if (role !== allowedRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default { authenticationToken, requireRole };
