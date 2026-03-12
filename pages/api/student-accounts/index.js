import { requireAuth } from '../../../lib/auth';
import { getStudentAccounts, createStudentAccount, initDb } from '../../../lib/db';

async function handler(req, res) {
  await initDb();
  if (req.method === 'GET') {
    return res.json(await getStudentAccounts());
  }
  if (req.method === 'POST') {
    if (Array.isArray(req.body)) {
      const results = [];
      for (const acc of req.body) {
        try { results.push(await createStudentAccount(acc)); } catch(e) { results.push({error:e.message,code:acc.code}); }
      }
      return res.status(201).json(results);
    }
    return res.status(201).json(await createStudentAccount(req.body));
  }
  res.status(405).end();
}
export default requireAuth(handler);
