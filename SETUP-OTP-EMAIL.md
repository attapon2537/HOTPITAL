# ตั้งค่าส่ง OTP ทาง E-mail ด้วย Brevo (ฟรี)

## 1. สมัคร Brevo
1. เปิด https://www.brevo.com → **Sign up free** (สมัครด้วย Gmail ได้)
2. กรอกข้อมูลบริษัทเป็น "โรงพยาบาลห้วยคต" เลือกแพ็กเกจ **Free**

## 2. ยืนยันอีเมลผู้ส่ง
1. มุมขวาบน → ชื่อบัญชี → **Senders, Domains & Dedicated IPs** → **Senders**
2. กด **Add a sender** → ใส่ชื่อ `HUAIKHOT HOTPITAL` และอีเมลของคุณ (Gmail ได้)
3. เปิดอีเมลยืนยันที่ Brevo ส่งมา แล้วกดยืนยัน

## 3. สร้าง API key
1. มุมขวาบน → ชื่อบัญชี → **SMTP & API** → แท็บ **API Keys**
2. กด **Generate a new API key** → ตั้งชื่อ `hotpital` → คัดลอกค่าที่ขึ้นต้นด้วย `xkeysib-...`

## 4. ใส่ค่าใน Vercel
Vercel → โปรเจกต์ hotpital → **Settings → Environment Variables** เพิ่ม 3 ค่า:

| Key | Value |
|---|---|
| `BREVO_API_KEY` | ค่า `xkeysib-...` จากข้อ 3 |
| `SENDER_EMAIL` | อีเมลที่ยืนยันในข้อ 2 |
| `OTP_SECRET` | ข้อความสุ่มยาว 32 ตัวขึ้นไป เช่น `hk-9f3Kx7Qp2Lm8Vz4Rt6Yw1Nb5Jc0Hd` |

(ถ้าเคยใส่ GMAIL_USER / GMAIL_APP_PASSWORD ไว้ ลบทิ้งได้)

## 5. อัปโหลดไฟล์ขึ้น GitHub (ชั้นนอกสุด)
```
api/send-otp.js
api/verify-otp.js
assets/hk-logo.png
index.html
package.json
```

## 6. Redeploy
Vercel → **Deployments** → ⋯ ที่รายการล่าสุด → **Redeploy**

## 7. ทดสอบ
ลงทะเบียนที่ **เพิ่มข้อมูลใบประกอบวิชาชีพ** ด้วยอีเมลจริง → ไป **ใบอนุญาตของฉัน** → กรอกเบอร์ → **ขอรหัส OTP** → เช็กอีเมล (และจดหมายขยะ)
