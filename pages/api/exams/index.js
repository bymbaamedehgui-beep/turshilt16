import { requireAuth } from '../../../lib/auth';
import { getExams, createExam, deleteExam, initDb } from '../../../lib/db';

async function handler(req, res) {
  await initDb();
  if (req.method === 'GET') {
    const exams = await getExams();
    return res.json(exams);
  }
  if (req.method === 'POST') {
    const exam = await createExam(req.body);
    return res.status(201).json(exam);
  }
  res.status(405).end();
}

export default requireAuth(handler);
