require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'users.json');
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function readUsers() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

async function saveUsers(users) {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getAuthToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function sendEmail(to, subject, text, html) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.RESET_FROM || user;

  if (!host || !user || !pass) {
    throw new Error('SMTP environment variables are not configured. See .env.example');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  await transporter.sendMail({ from, to, subject, text, html });
}

async function findUserByToken(token) {
  const users = await readUsers();
  return users.find(user => user.authToken === token);
}

async function authGuard(req, res, next) {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const users = await readUsers();
  const user = users.find(u => u.authToken === token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password diperlukan.' });
  }

  const users = await readUsers();
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ error: 'Username sudah terpakai.' });
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email sudah terdaftar.' });
  }

  users.push({
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: hashPassword(password),
    authToken: null,
    resetToken: null,
    resetTokenExpiry: null
  });
  await saveUsers(users);

  res.status(201).json({ message: 'Pendaftaran berhasil. Silakan login.' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password diperlukan.' });
  }

  const users = await readUsers();
  const user = users.find(u => u.username === username);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  user.authToken = createToken();
  await saveUsers(users);
  res.json({ token: user.authToken, username: user.username, email: user.email });
});

app.get('/api/profile', authGuard, (req, res) => {
  const { username, email } = req.user;
  res.json({ username, email });
});

app.post('/api/logout', authGuard, async (req, res) => {
  const token = getAuthToken(req);
  const users = await readUsers();
  const user = users.find(entry => entry.authToken === token);
  if (user) {
    user.authToken = null;
    await saveUsers(users);
  }
  res.json({ message: 'Logout berhasil.' });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email diperlukan.' });

  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ message: 'Jika email ditemukan, instruksi reset akan dikirimkan.' });
  }

  user.resetToken = createToken();
  user.resetTokenExpiry = Date.now() + 3600 * 1000;
  await saveUsers(users);

  const resetLink = `${BASE_URL}/anime.html?resetToken=${user.resetToken}&email=${encodeURIComponent(user.email)}`;
  const text = `Permintaan reset password diterima. Gunakan tautan berikut untuk mengganti password: ${resetLink}`;
  const html = `<p>Permintaan reset password diterima.</p><p>Gunakan tautan berikut untuk mengganti password:</p><p><a href="${resetLink}">${resetLink}</a></p>`;

  try {
    await sendEmail(user.email, 'Reset Password Shirokazuki Anime', text, html);
    res.json({ message: 'Instruksi reset password telah dikirim ke email Anda.' });
  } catch (error) {
    console.error('Email gagal dikirim:', error);
    res.status(500).json({ error: 'Gagal mengirim email reset. Periksa konfigurasi SMTP.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token dan password baru diperlukan.' });
  }

  const users = await readUsers();
  const user = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());
  if (!user) {
    return res.status(400).json({ error: 'Token reset tidak valid atau sudah kedaluwarsa.' });
  }

  user.passwordHash = hashPassword(password);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await saveUsers(users);

  res.json({ message: 'Password berhasil diperbarui. Silakan login dengan password baru.' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
  console.log('Jalankan `npm install` terlebih dahulu, lalu `npm start`.');
});
