const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const usersPath = path.join(__dirname, 'data', 'users.json');
const ordersPath = path.join(__dirname, 'data', 'orders.json');

const seededUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Demo Customer', email: 'user@example.com', password: 'user123', role: 'customer' }
];

let users = [];
if (fs.existsSync(usersPath)) {
  users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
}

seededUsers.forEach((seed) => {
  const exists = users.some((user) => normalizeEmail(user.email) === normalizeEmail(seed.email));
  if (!exists) {
    users.push({ ...seed, id: Date.now() + Math.random() });
  }
});

if (!fs.existsSync(usersPath) || users.length > 0) {
  saveUsers();
}

let orders = [];
if (fs.existsSync(ordersPath)) {
  orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
}

function saveUsers() {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

function saveOrders() {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}


let products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 2499,
    oldPrice: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 4999,
    oldPrice: 6500,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Portable Blender',
    price: 1599,
    oldPrice: 2000,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1570564261324-2baff1f8d1a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Running Shoes',
    price: 2199,
    oldPrice: 2800,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  }
];

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password.' });
  }

  const exists = users.some((user) => normalizeEmail(user.email) === normalizedEmail);
  if (exists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const user = { id: Date.now(), name: name.trim(), email: normalizedEmail, password, role: 'customer' };
  users.push(user);
  saveUsers();
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const user = users.find((item) => normalizeEmail(item.email) === normalizedEmail && item.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product = {
    id: Date.now(),
    ...req.body
  };
  products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products[index] = { ...products[index], ...req.body, id };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: 'Product removed' });
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  saveOrders();
  res.status(201).json(order);
});

app.get('/api/orders/:email', (req, res) => {
  const email = normalizeEmail(req.params.email);
  const userOrders = orders.filter((order) => normalizeEmail(order.customerEmail) === email);
  res.json(userOrders);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.use((err, req, res, next) => {
  if (err && err.status === 400 && err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body.' });
  }
  next(err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
