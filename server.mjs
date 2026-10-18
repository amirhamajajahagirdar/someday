import { createServer as httpCreateServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFile, stat } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.ico': 'image/x-icon' };
const ADMIN_SALT = 'someday-admin-salt-v1';
const ADMIN_PASSWORD_HASH = 'ac6e6d3211b58099edb7cda4814eb84dfb2603cfe5102355181fa3ee0e0307d24365273b2fa8fc5b180f17841d33620c3a7e5ca419b8b535ec0d65435f885803';
const SESSION_MS = 12 * 60 * 60 * 1000;

export function validateLetter(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Request body must be a JSON object.');
  if (typeof input.title !== 'string' || !input.title.trim()) throw new Error('Give your letter a name.');
  if (input.title.trim().length > 120) throw new Error('The title must be 120 characters or fewer.');
  if (typeof input.body !== 'string' || !input.body.trim()) throw new Error('Write a message before sealing your letter.');
  if (input.body.length > 20000) throw new Error('Your message must be 20,000 characters or fewer.');
  const date = input.open_date;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('Choose a valid opening date.');
  const today = new Date().toISOString().slice(0, 10);
  if (date <= today) throw new Error('Choose a day in the future.');
  return { title: input.title.trim(), body: input.body.trim(), open_date: date };
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
async function readBody(req) {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 64_000) throw new Error('Request body is too large.');
  }
  try { return JSON.parse(data || '{}'); } catch { throw new Error('Request body must be valid JSON.'); }
}

export function createAppServer({ dbPath = resolve(ROOT, 'data/someday.db'), staticDir = resolve(ROOT, 'static'), adminPasswordSalt = ADMIN_SALT, adminPasswordHash = ADMIN_PASSWORD_HASH } = {}) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
      body TEXT NOT NULL,
      open_date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`);
  const sessions = new Map();
  const loginAttempts = new Map();
  function sessionToken(req) {
    const cookie = req.headers.cookie ?? '';
    return cookie.split(';').map(part => part.trim()).find(part => part.startsWith('someday_admin='))?.slice('someday_admin='.length);
  }
  function isAdmin(req) {
    const token = sessionToken(req);
    const session = token && sessions.get(token);
    if (!session) return false;
    if (session.expiresAt <= Date.now()) { sessions.delete(token); return false; }
    return true;
  }
  function originAllowed(req) {
    const origin = req.headers.origin;
    if (!origin) return true;
    const expected = `${req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}`;
    return origin === expected;
  }
  function checkPassword(password) {
    if (typeof password !== 'string' || Buffer.byteLength(password) > 256) return false;
    const actual = scryptSync(password, adminPasswordSalt, 64);
    const expected = Buffer.from(adminPasswordHash, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
  const server = httpCreateServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        if (url.pathname === '/api/admin/login' && req.method === 'POST') {
          if (!originAllowed(req)) return json(res, 403, { error: 'Request origin is not allowed.' });
          const ip = req.socket.remoteAddress ?? 'unknown';
          const attempts = loginAttempts.get(ip) ?? { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
          if (attempts.resetAt <= Date.now()) { attempts.count = 0; attempts.resetAt = Date.now() + 15 * 60 * 1000; }
          if (attempts.count >= 5) return json(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
          const input = await readBody(req);
          if (!checkPassword(input.password)) {
            attempts.count += 1; loginAttempts.set(ip, attempts);
            return json(res, 401, { error: 'That password did not match.' });
          }
          loginAttempts.delete(ip);
          const token = randomBytes(32).toString('base64url');
          sessions.set(token, { expiresAt: Date.now() + SESSION_MS });
          res.setHeader('Set-Cookie', `someday_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(SESSION_MS / 1000)}`);
          return json(res, 200, { authenticated: true });
        }
        if (url.pathname === '/api/admin/logout' && req.method === 'POST') {
          if (!originAllowed(req)) return json(res, 403, { error: 'Request origin is not allowed.' });
          const token = sessionToken(req); if (token) sessions.delete(token);
          res.setHeader('Set-Cookie', 'someday_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
          return json(res, 200, { authenticated: false });
        }
        if (url.pathname === '/api/letters' && req.method === 'GET') {
          return json(res, 200, db.prepare('SELECT id, title, open_date, created_at FROM letters ORDER BY open_date ASC, created_at DESC').all());
        }
        if (url.pathname === '/api/admin/letters' && req.method === 'GET') {
          if (!isAdmin(req)) return json(res, 401, { error: 'Admin sign-in is required.' });
          return json(res, 200, db.prepare('SELECT * FROM letters ORDER BY created_at DESC').all());
        }
        if (url.pathname === '/api/letters' && req.method === 'POST') {
          const letter = validateLetter(await readBody(req));
          const result = db.prepare('INSERT INTO letters(title, body, open_date, created_at) VALUES(?,?,?,?)').run(letter.title, letter.body, letter.open_date, new Date().toISOString());
          return json(res, 201, db.prepare('SELECT id, title, open_date, created_at FROM letters WHERE id=?').get(result.lastInsertRowid));
        }
        const match = url.pathname.match(/^\/api\/letters\/(\d+)$/);
        if (match && req.method === 'GET') {
          const letter = db.prepare('SELECT * FROM letters WHERE id=?').get(Number(match[1]));
          if (!letter) return json(res, 404, { error: 'Letter not found.' });
          if (letter.open_date > new Date().toISOString().slice(0, 10)) return json(res, 423, { error: 'This letter is still sealed. It will open on its chosen date.' });
          return json(res, 200, letter);
        }
        return json(res, 404, { error: 'Not found.' });
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed.' });
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch { return json(res, 400, { error: 'Invalid path.' }); }
      if (pathname === '/' || pathname === '/write' || pathname === '/capsules' || pathname === '/admin' || /^\/letter\/\d+$/.test(pathname)) pathname = '/index.html';
      const root = resolve(staticDir);
      const file = resolve(root, `.${pathname}`);
      if (!file.startsWith(root + sep)) return json(res, 403, { error: 'Forbidden.' });
      const info = await stat(file).catch(() => null);
      if (!info?.isFile()) return json(res, 404, { error: 'Not found.' });
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
      if (req.method === 'HEAD') return res.end();
      res.end(await readFile(file));
    } catch (error) {
      const status = /too large/i.test(error.message) ? 413 : /valid JSON|JSON object|letter a name|120 characters|message|opening date|future/i.test(error.message) ? 400 : 500;
      json(res, status, { error: error.message || 'Internal server error.' });
    }
  });
  server.on('close', () => db.close());
  return server;
}

function parseArgs(args) {
  const opts = { host: '127.0.0.1', port: 8000 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--host' && args[i + 1]) opts.host = args[++i];
    else if (args[i] === '--port' && args[i + 1]) opts.port = Number(args[++i]);
    else if (args[i] === '--help') { console.log('Usage: node server.mjs [--host 127.0.0.1|0.0.0.0] [--port 8000]'); process.exit(0); }
    else throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  if (!Number.isInteger(opts.port) || opts.port < 1 || opts.port > 65535) throw new Error('Port must be an integer from 1 to 65535.');
  return opts;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { host, port } = parseArgs(process.argv.slice(2));
    const server = createAppServer();
    server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Close the other server or choose another port.` : error.message); process.exitCode = 1; });
    server.listen(port, host, () => console.log(`Someday is ready at http://${host}:${port}`));
    for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
