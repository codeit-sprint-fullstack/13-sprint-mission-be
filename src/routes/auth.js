const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../servides/authService");

const router = exporess.Router();

router.route("/signUp").post(
  asyncHandler(async (req, res) => {
    res.status(201).json(await authService.signUp(req.body));
  }),
);

router.route("/signIn").post(
  asyncHandler(async (req, res) => {
    res.json(await authService.signIn(req.body));
  }),
);

router.route("/refresh").post(
  asyncHandler(async (req, res) => {
    res.json(await authService.refresh(req.body.refreshToken));
  }),
);

module.exports = router;
