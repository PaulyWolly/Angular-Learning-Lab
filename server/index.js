/**
 * Tiny learning-lab API: Express + SQLite (better-sqlite3).
 * Serves product rows for the Ag-Grid Community editable demo.
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

app.listen(PORT, () => {
  console.log(`[api] SQLite lab API listening on http://localhost:${PORT}`);
  console.log(`[api] DB file: ${dbPath}`);
});
