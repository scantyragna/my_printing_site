module.exports = (req, res) => {
  const auth = require('./auth');
  return auth.handleLogin(req, res);
};
