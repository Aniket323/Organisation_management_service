const jwt = require('jsonwebtoken');
const jwtCfg = require('../config/jwt.config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

  if (!token) return res.status(401).json({ error: 'token missing' });

  try {
    const payload = jwt.verify(token, jwtCfg.secret);
    req.adminEmail = payload.adminEmail;
    req.organizationId = payload.organizationId;
    req.organizationName = payload.organizationName;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = authMiddleware;
