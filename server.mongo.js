
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { MongoClient, ObjectId } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(cookieParser());

// ---- MongoDB Connection ----
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'mkjewelery';
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI env var');
  process.exit(1);
}
const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(DB_NAME);
const Users = db.collection('users');
const Products = db.collection('products');
const Carts = db.collection('carts');
const CartItems = db.collection('cart_items');

// ---- Indexes (idempotent) ----
await Users.createIndex({ email: 1 }, { unique: true });
await Products.createIndex({ sku: 1 }, { unique: true });
await Carts.createIndex({ userId: 1 }, { unique: true, sparse: true });
await Carts.createIndex({ sessionId: 1 }, { unique: true, sparse: true });
await CartItems.createIndex({ cartId: 1, productId: 1 }, { unique: true });

// ---- Helpers ----
const now = () => Math.floor(Date.now() / 1000);
const newId = (p) => p + '_' + crypto.randomBytes(8).toString('hex');
const hash = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

async function seedProductsIfEmpty(){
  const count = await Products.estimatedDocumentCount();
  if (count > 0) return;
  const ts = now();
  await Products.insertMany([
    { _id: 'p_1', sku: 'RING-001', name: 'Gold Ring', description: '18k gold ring', price_cents: 12999, image_url: '/images/ring1.jpg', created_at: ts, updated_at: ts },
    { _id: 'p_2', sku: 'NECK-002', name: 'Silver Necklace', description: 'Sterling silver', price_cents: 8999, image_url: '/images/necklace1.jpg', created_at: ts, updated_at: ts },
    { _id: 'p_3', sku: 'EAR-003', name: 'Diamond Earrings', description: 'Lab-grown', price_cents: 159999, image_url: '/images/earrings1.jpg', created_at: ts, updated_at: ts },
  ]);
}
await seedProductsIfEmpty();

async function getOrCreateCart({ userId, sessionId }){
  let cart;
  if (userId){
    cart = await Carts.findOne({ userId });
    if (!cart){
      const doc = { _id: newId('c'), userId, created_at: now(), updated_at: now() };
      await Carts.insertOne(doc);
      cart = doc;
    }
  } else {
    cart = await Carts.findOne({ sessionId });
    if (!cart){
      const doc = { _id: newId('c'), sessionId, created_at: now(), updated_at: now() };
      await Carts.insertOne(doc);
      cart = doc;
    }
  }
  return cart;
}

function resolveSessionId(req){
  const fromCookie = req.cookies?.sid;
  const fromHeader = req.header('X-Session-Id');
  return fromCookie || fromHeader || newId('anon');
}

// ---- Auth ----
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const doc = { _id: newId('u'), email: String(email).toLowerCase(), password_hash: hash(password), role: 'user', created_at: now() };
    await Users.insertOne(doc);
    res.json({ id: doc._id, email: doc.email, role: doc.role });
  } catch (e) {
    if (String(e).includes('E11000')) return res.status(409).json({ error: 'email exists' });
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  const u = await Users.findOne({ email: String(email||'').toLowerCase() });
  if (!u || u.password_hash !== hash(password)) return res.status(401).json({ error: 'invalid credentials' });
  const sid = newId('s');
  res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax', maxAge: 1000*60*60*24*30 });
  res.json({ id: u._id, email: u.email, role: u.role });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sid');
  res.json({ ok: true });
});

// ---- Products ----
app.get('/api/products', async (req, res) => {
  const rows = await Products.find().sort({ created_at: -1 }).toArray();
  res.json(rows.map(({ _id, ...rest }) => ({ id: _id, ...rest })));
});

app.get('/api/products/:id', async (req, res) => {
  const row = await Products.findOne({ _id: req.params.id });
  if (!row) return res.status(404).json({ error: 'not found' });
  const { _id, ...rest } = row;
  res.json({ id: _id, ...rest });
});

app.post('/api/products', async (req, res) => {
  const { sku, name, description, price_cents, image_url } = req.body || {};
  const doc = { _id: newId('p'), sku, name, description: description||'', price_cents, image_url: image_url||'', created_at: now(), updated_at: now() };
  try{
    await Products.insertOne(doc);
    const { _id, ...rest } = doc;
    res.json({ id: _id, ...rest });
  }catch(e){
    if (String(e).includes('E11000')) return res.status(409).json({ error: 'duplicate sku' });
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { name, description, price_cents, image_url } = req.body || {};
  const r = await Products.updateOne({ _id: req.params.id }, { $set: { name, description: description||'', price_cents, image_url: image_url||'', updated_at: now() } });
  if (r.matchedCount === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

app.delete('/api/products/:id', async (req, res) => {
  const r = await Products.deleteOne({ _id: req.params.id });
  if (r.deletedCount === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// ---- Cart ----
app.get('/api/cart', async (req, res) => {
  const sessionId = resolveSessionId(req);
  const cart = await getOrCreateCart({ sessionId });
  const items = await CartItems.aggregate([
    { $match: { cartId: cart._id } },
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' }
  ]).toArray();
  const normalized = items.map(ci => ({
    id: ci._id,
    qty: ci.qty,
    product: { id: ci.product._id, ...Object.fromEntries(Object.entries(ci.product).filter(([k]) => k !== '_id')) }
  }));
  res.json({ cartId: cart._id, sessionId, items: normalized });
});

app.post('/api/cart/items', async (req, res) => {
  const { product_id, qty } = req.body || {};
  if (!product_id || !qty) return res.status(400).json({ error: 'product_id and qty required' });
  const sessionId = resolveSessionId(req);
  const cart = await getOrCreateCart({ sessionId });
  const existing = await CartItems.findOne({ cartId: cart._id, productId: product_id });
  if (existing){
    await CartItems.updateOne({ _id: existing._id }, { $set: { qty, updated_at: now() } });
  } else {
    await CartItems.insertOne({ _id: newId('ci'), cartId: cart._id, productId: product_id, qty, created_at: now(), updated_at: now() });
  }
  const items = await CartItems.find({ cartId: cart._id }).toArray();
  res.json({ cartId: cart._id, items });
});

app.delete('/api/cart/items/:id', async (req, res) => {
  const r = await CartItems.deleteOne({ _id: req.params.id });
  if (r.deletedCount === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// ---- Static & SPA fallback ----
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Mongo API running on ' + PORT));
