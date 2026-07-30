const fs = require('fs');
const path = require('path');
const os = require('os');

const dataFile = path.join(os.tmpdir(), 'daraz-demo-data.json');

const seededUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Demo Customer', email: 'user@example.com', password: 'user123', role: 'customer' }
];

const seededProducts = [
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

function createDefaultState() {
  return {
    users: seededUsers.map((user) => ({ ...user })),
    products: seededProducts.map((product) => ({ ...product })),
    orders: []
  };
}

function readState() {
  try {
    if (fs.existsSync(dataFile)) {
      const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : seededProducts.map((product) => ({ ...product })),
        orders: Array.isArray(parsed.orders) ? parsed.orders : []
      };
    }
  } catch (error) {
    // Fall back to defaults if the file is missing or invalid.
  }

  const state = createDefaultState();
  saveState(state);
  return state;
}

function saveState(state) {
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

module.exports = {
  readState,
  saveState,
  normalizeEmail,
  createDefaultState
};
