import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// In-memory products; replace with a database in production
let products = [];

app.get('/api/products', (req, res) => res.json(products));
app.post('/api/products', (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.price) return res.status(400).json({ error: 'invalid' });
  b.id = b.id || ('p_' + Date.now());
  products = [b, ...products];
  res.json(b);
});

// Serve static assets from dist
const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));
app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on ' + port));
