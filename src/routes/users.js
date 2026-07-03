const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { requireAuth } = require("../middlewares/auth");
const userService = require("../services/userService");

const router = express.Router();

router.route("/me").get(
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(userService.me(req.user));
  }),
);

module.exports = router;
