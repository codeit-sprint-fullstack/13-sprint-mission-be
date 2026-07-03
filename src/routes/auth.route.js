const express = require("express");
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.route("/signUp").post(asyncHandler(authController.signUp));
router.route("/signIn").post(asyncHandler(authController.signIn));
router.route("/refresh").post(asyncHandler(authController.refresh));

module.exports = router;
