const express = require("express");
const userController = require("../controllers/user.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/me").get(requireAuth, asyncHandler(userController.me));

module.exports = router;
