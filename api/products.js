const { readState } = require('./_lib/store');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const state = readState();
  res.status(200).json(state.products);
};
