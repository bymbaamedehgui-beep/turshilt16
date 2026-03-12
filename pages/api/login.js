import { checkCredentials, signToken } from '../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (!checkCredentials(username, password)) {
    return res.status(401).json({ error: 'Нэвтрэх нэр эсвэл нууц үг буруу' });
  }
  const token = signToken(username);
  res.json({ token });
}
