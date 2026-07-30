const { readState, normalizeEmail } = require('../_lib/store');

module.exports = function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);
  const state = readState();
  const user = state.users.find((item) => normalizeEmail(item.email) === normalizedEmail && item.password === password);

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials.' });
    return;
  }

  res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
};
