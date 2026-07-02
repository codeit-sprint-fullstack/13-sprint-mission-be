const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const userService = require("../services/userService");

const router = express.Router();

router.route("/me").get(requireAuth, (req, res) => {
  res.json(userService.me(req.user));
});

module.exports = router;
