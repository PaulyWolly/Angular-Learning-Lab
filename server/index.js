/**
 * Tiny learning-lab API: Express + SQLite (better-sqlite3).
 * Serves product rows (Ag-Grid) and developer rows (Material table lab).
 *
 * Start: npm run api   →  http://localhost:3001
 * Angular proxies /api → this server (see proxy.conf.json).
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const PORT = Number(process.env.API_PORT) || 3001;
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'lab.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
  );
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM products').get().n;
if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (make, model, price, stock) VALUES (@make, @model, @price, @stock)',
  );
  const seed = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  seed([
    { make: 'Apple', model: 'iPhone 15', price: 999, stock: 42 },
    { make: 'Google', model: 'Pixel 8', price: 699, stock: 28 },
    { make: 'Samsung', model: 'Galaxy S24', price: 799, stock: 35 },
    { make: 'Sony', model: 'Xperia 1 V', price: 1199, stock: 12 },
    { make: 'OnePlus', model: '12', price: 799, stock: 19 },
    { make: 'Apple', model: 'iPhone SE', price: 429, stock: 55 },
  ]);
  console.log('[api] Seeded products table');
}

const DEVELOPER_SEED = [
  { name: 'Ada Lovelace', role: 'Algorithm Pioneer', level: 'Lead', department: 'R&D', contributions: 184 },
  { name: 'Grace Hopper', role: 'Compiler Architect', level: 'Lead', department: 'Systems', contributions: 142 },
  { name: 'Alan Turing', role: 'Cryptography Expert', level: 'Senior', department: 'Security', contributions: 129 },
  { name: 'Margaret Hamilton', role: 'Guidance Software Lead', level: 'Lead', department: 'Apollo Systems', contributions: 210 },
  { name: 'John von Neumann', role: 'Architecture Specialist', level: 'Senior', department: 'Hardware', contributions: 98 },
  { name: 'Claude Shannon', role: 'Information Theorist', level: 'Senior', department: 'R&D', contributions: 115 },
  { name: 'Barbara Liskov', role: 'Substitution Principle Pioneer', level: 'Lead', department: 'Architecture', contributions: 175 },
  { name: 'Linus Torvalds', role: 'Kernel Maintainer', level: 'Lead', department: 'Open Source', contributions: 320 },
  { name: 'Tim Berners-Lee', role: 'Web Protocol Architect', level: 'Senior', department: 'Standards', contributions: 160 },
  { name: 'Brendan Eich', role: 'Language Designer', level: 'Mid', department: 'Frontend', contributions: 88 },
];

db.exec(`
  CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    level TEXT NOT NULL,
    department TEXT NOT NULL,
    contributions INTEGER NOT NULL
  );
`);

function listDevelopers() {
  return db
    .prepare(
      'SELECT id, name, role, level, department, contributions FROM developers ORDER BY id',
    )
    .all();
}

function insertDeveloperSeed() {
  const insert = db.prepare(
    'INSERT INTO developers (name, role, level, department, contributions) VALUES (@name, @role, @level, @department, @contributions)',
  );
  const run = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  run(DEVELOPER_SEED);
}

if (db.prepare('SELECT COUNT(*) AS n FROM developers').get().n === 0) {
  insertDeveloperSeed();
  console.log('[api] Seeded developers table');
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: 'sqlite', file: 'server/data/lab.db' });
});

app.get('/api/products', (_req, res) => {
  const rows = db.prepare('SELECT id, make, model, price, stock FROM products ORDER BY id').all();
  res.json(rows);
});

app.get('/api/products/:id', (req, res) => {
  const row = db
    .prepare('SELECT id, make, model, price, stock FROM products WHERE id = ?')
    .get(Number(req.params.id));
  if (!row) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(row);
});

app.patch('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const make = req.body.make ?? existing.make;
  const model = req.body.model ?? existing.model;
  const price = Number(req.body.price ?? existing.price);
  const stock = Number(req.body.stock ?? existing.stock);

  if (!make || !model || Number.isNaN(price) || Number.isNaN(stock)) {
    res.status(400).json({ error: 'Invalid product fields' });
    return;
  }

  db.prepare(
    'UPDATE products SET make = ?, model = ?, price = ?, stock = ? WHERE id = ?',
  ).run(make, model, price, stock, id);

  const updated = db
    .prepare('SELECT id, make, model, price, stock FROM products WHERE id = ?')
    .get(id);
  res.json(updated);
});

app.post('/api/products', (req, res) => {
  const make = String(req.body.make ?? '').trim();
  const model = String(req.body.model ?? '').trim();
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  if (!make || !model || Number.isNaN(price) || Number.isNaN(stock)) {
    res.status(400).json({ error: 'make, model, price, stock are required' });
    return;
  }
  const info = db
    .prepare('INSERT INTO products (make, model, price, stock) VALUES (?, ?, ?, ?)')
    .run(make, model, price, stock);
  const row = db
    .prepare('SELECT id, make, model, price, stock FROM products WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(row);
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(204).end();
});

app.post('/api/products/reset', (_req, res) => {
  db.exec('DELETE FROM products');
  const insert = db.prepare(
    'INSERT INTO products (make, model, price, stock) VALUES (@make, @model, @price, @stock)',
  );
  const seed = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  seed([
    { make: 'Apple', model: 'iPhone 15', price: 999, stock: 42 },
    { make: 'Google', model: 'Pixel 8', price: 699, stock: 28 },
    { make: 'Samsung', model: 'Galaxy S24', price: 799, stock: 35 },
    { make: 'Sony', model: 'Xperia 1 V', price: 1199, stock: 12 },
    { make: 'OnePlus', model: '12', price: 799, stock: 19 },
    { make: 'Apple', model: 'iPhone SE', price: 429, stock: 55 },
  ]);
  const rows = db.prepare('SELECT id, make, model, price, stock FROM products ORDER BY id').all();
  res.json(rows);
});

const LEVELS = new Set(['Junior', 'Mid', 'Senior', 'Lead']);

function readDeveloperBody(body, existing) {
  const name = String(body.name ?? existing?.name ?? '').trim();
  const role = String(body.role ?? existing?.role ?? '').trim();
  const level = String(body.level ?? existing?.level ?? '').trim();
  const department = String(body.department ?? existing?.department ?? '').trim();
  const contributions = Number(body.contributions ?? existing?.contributions);
  if (!name || !role || !LEVELS.has(level) || !department || Number.isNaN(contributions)) {
    return null;
  }
  return { name, role, level, department, contributions };
}

app.get('/api/developers', (_req, res) => {
  res.json(listDevelopers());
});

app.post('/api/developers/seed', (_req, res) => {
  const n = db.prepare('SELECT COUNT(*) AS n FROM developers').get().n;
  if (n === 0) {
    insertDeveloperSeed();
  }
  res.json({ alreadySeeded: n > 0, rows: listDevelopers() });
});

app.post('/api/developers/reset', (_req, res) => {
  db.exec('DELETE FROM developers');
  insertDeveloperSeed();
  res.json(listDevelopers());
});

app.post('/api/developers', (req, res) => {
  const parsed = readDeveloperBody(req.body);
  if (!parsed) {
    res.status(400).json({ error: 'name, role, level, department, contributions are required' });
    return;
  }
  const info = db
    .prepare(
      'INSERT INTO developers (name, role, level, department, contributions) VALUES (?, ?, ?, ?, ?)',
    )
    .run(parsed.name, parsed.role, parsed.level, parsed.department, parsed.contributions);
  const row = db
    .prepare('SELECT id, name, role, level, department, contributions FROM developers WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(row);
});

app.patch('/api/developers/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM developers WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Developer not found' });
    return;
  }
  const parsed = readDeveloperBody(req.body, existing);
  if (!parsed) {
    res.status(400).json({ error: 'Invalid developer fields' });
    return;
  }
  db.prepare(
    'UPDATE developers SET name = ?, role = ?, level = ?, department = ?, contributions = ? WHERE id = ?',
  ).run(parsed.name, parsed.role, parsed.level, parsed.department, parsed.contributions, id);
  const updated = db
    .prepare('SELECT id, name, role, level, department, contributions FROM developers WHERE id = ?')
    .get(id);
  res.json(updated);
});

app.delete('/api/developers/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM developers WHERE id = ?').run(id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Developer not found' });
    return;
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`[api] SQLite lab API listening on http://localhost:${PORT}`);
  console.log(`[api] DB file: ${dbPath}`);
});
