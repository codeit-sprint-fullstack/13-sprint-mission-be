const userService = require("../services/user.service");

function me(req, res) {
  res.json(userService.me(req.user));
}

module.exports = { me };
