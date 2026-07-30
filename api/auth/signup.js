const { readState, saveState, normalizeEmail } = require('../_lib/store');

module.exports = function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { name, email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    res.status(400).json({ message: 'Please provide name, email and password.' });
    return;
  }

  const state = readState();
  const exists = state.users.some((user) => normalizeEmail(user.email) === normalizedEmail);
  if (exists) {
    res.status(400).json({ message: 'User already exists.' });
    return;
  }

  const user = { id: Date.now(), name: name.trim(), email: normalizedEmail, password, role: 'customer' };
  state.users.push(user);
  saveState(state);

  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
};
