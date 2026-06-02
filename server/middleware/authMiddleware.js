import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_super_secret_key_change_this';

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attaches the log-in user ID to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session token.' });
  }
};