const { readState, saveState } = require('./_lib/store');

module.exports = function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const state = readState();

  if (req.method === 'GET') {
    res.status(200).json(state.orders);
    return;
  }

  if (req.method === 'POST') {
    const order = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    state.orders.push(order);
    saveState(state);
    res.status(201).json(order);
    return;
  }

  res.status(405).json({ message: 'Method not allowed' });
};
