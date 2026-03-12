import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'eyesh-default-secret-2025';
const CREDENTIALS = {
  username: process.env.APP_USERNAME || 'admin',
  password: process.env.APP_PASSWORD || 'eyesh2025',
};

export function checkCredentials(username, password) {
  return username === CREDENTIALS.username && password === CREDENTIALS.password;
}

export function signToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function requireAuth(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token || !verifyToken(token)) {
      return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
    }
    return handler(req, res);
  };
}
