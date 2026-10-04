// ตรวจรหัส OTP
const crypto = require('crypto');
const SECRET = process.env.OTP_SECRET || '';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const { token, code } = req.body || {};
  if (!SECRET || !token || !/^\d{6}$/.test(code || '')) return res.status(200).json({ ok: false });
  const [payload, sig] = String(token).split('.');
  let data;
  try { data = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch (e) { return res.status(200).json({ ok: false }); }
  if (!data.x || Date.now() > data.x) return res.status(200).json({ ok: false, expired: true });
  const expect = crypto.createHmac('sha256', SECRET).update(payload + '|' + code).digest('base64url');
  const a = Buffer.from(expect), b = Buffer.from(sig || '');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  return res.status(200).json({ ok });
};
