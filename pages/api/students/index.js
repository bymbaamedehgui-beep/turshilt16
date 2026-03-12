import { requireAuth } from '../../../lib/auth';
import { getStudents, createStudent, initDb } from '../../../lib/db';

async function handler(req, res) {
  await initDb();
  if (req.method === 'GET') {
    const { examId } = req.query;
    const students = await getStudents(examId);
    return res.json(students);
  }
  if (req.method === 'POST') {
    const student = await createStudent(req.body);
    return res.status(201).json(student);
  }
  res.status(405).end();
}

export default requireAuth(handler);
