import { requireAuth } from '../../../lib/auth';
import { getExam, deleteExam, initDb } from '../../../lib/db';
import { neon } from '@neondatabase/serverless';

function getDb() { return neon(process.env.POSTGRES_URL || process.env.DATABASE_URL); }

async function handler(req, res) {
  await initDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    const exam = await getExam(id);
    if (!exam) return res.status(404).json({ error: 'Олдсонгүй' });
    return res.json(exam);
  }

  if (req.method === 'PUT') {
    const e = req.body;
    const sql = getDb();
    const rows = await sql`
      UPDATE exams SET
        title=${e.title}, subject=${e.subject}, sec1_count=${e.sec1Count},
        sec1_key=${JSON.stringify(e.sec1Key)}, sec1_scores=${JSON.stringify(e.sec1Scores)},
        topics=${JSON.stringify(e.topics)}, use_sec2=${e.useSec2},
        sec2_config=${JSON.stringify(e.sec2Config||{})}, sec2_score=${e.sec2Score||5}
      WHERE id=${id} RETURNING *`;
    if (!rows[0]) return res.status(404).json({ error: 'Олдсонгүй' });
    const r = rows[0];
    return res.json({ id:r.id,title:r.title,subject:r.subject,sec1Count:r.sec1_count,
      sec1Key:r.sec1_key,sec1Scores:r.sec1_scores,topics:r.topics,
      useSec2:r.use_sec2,sec2Config:r.sec2_config,sec2Score:r.sec2_score,createdAt:r.created_at });
  }

  if (req.method === 'DELETE') {
    await deleteExam(id);
    return res.json({ ok: true });
  }

  res.status(405).end();
}

export default requireAuth(handler);
