// ส่งรหัส OTP ไปที่ E-mail ผ่าน Brevo (ฟรี 300 ฉบับ/วัน)
const crypto = require('crypto');

const SECRET = process.env.OTP_SECRET || '';
const sign = (payload, code) => crypto.createHmac('sha256', SECRET).update(payload + '|' + code).digest('base64url');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  if (!SECRET || !process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    return res.status(500).json({ error: 'ระบบยังไม่ได้ตั้งค่าการส่งอีเมล (Environment Variables)' });
  }
  const { email, name, site } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'E-mail ไม่ถูกต้อง' });

  const code = String(crypto.randomInt(100000, 1000000));
  const exp = Date.now() + 5 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ e: email.toLowerCase(), x: exp })).toString('base64url');
  const token = payload + '.' + sign(payload, code);

  const title = site || 'HUAIKHOT HOTPITAL';
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
      sender: { name: title, email: process.env.SENDER_EMAIL },
      to: [{ email, name: name || email }],
      subject: `รหัส OTP สำหรับเข้าดูใบประกอบวิชาชีพ: ${code}`,
      textContent: `สวัสดีค่ะ ${name || ''}\n\nรหัส OTP ของคุณคือ ${code}\nรหัสนี้ใช้ได้ภายใน 5 นาที ห้ามบอกรหัสนี้กับผู้อื่น\n\nหากคุณไม่ได้ขอรหัสนี้ ไม่ต้องทำอะไร\n— ${title}`,
      htmlContent: `<div style="font-family:Tahoma,sans-serif;max-width:480px;margin:auto;padding:28px;background:#f5ead8;border-radius:24px;color:#201e1d">
        <h2 style="margin:0 0 6px">${title}</h2>
        <p style="margin:0 0 20px;color:#645c50">รหัสยืนยันตัวตนสำหรับเข้าดูใบประกอบวิชาชีพ</p>
        <p style="margin:0 0 8px">สวัสดีค่ะ ${name || ''}</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:10px;background:#fff;border-radius:18px;padding:18px;text-align:center;color:#8c491a">${code}</div>
        <p style="margin:18px 0 0;font-size:14px;color:#645c50">รหัสนี้ใช้ได้ภายใน 5 นาที ห้ามบอกรหัสนี้กับผู้อื่น<br>หากคุณไม่ได้ขอรหัสนี้ ไม่ต้องทำอะไร</p>
      </div>`,
      }),
    });
    if (!r.ok) throw new Error(await r.text());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'ส่งอีเมลไม่สำเร็จ ตรวจสอบการตั้งค่า Brevo' });
  }
  return res.status(200).json({ token });
};
