const express = require("express");
const prisma = require("../lib/prisma");
const ENDPOINTS = require("../constants/endpoints");
const { hashPassword, comparePassword } = require("../utils/password");
const { createAccessToken } = require("../utils/token");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  nickname: user.nickname,
  image: user.image,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateSignUpInput = ({ email, nickname, password }) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    return "올바른 이메일을 입력해 주세요.";
  }

  if (!nickname || nickname.trim().length < 2) {
    return "닉네임은 2자 이상 입력해 주세요.";
  }

  if (!password || password.length < 8) {
    return "비밀번호는 8자 이상 입력해 주세요.";
  }

  return "";
};

const signUp = async (req, res, next) => {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;
    const validationMessage = validateSignUpInput({
      email,
      nickname,
      password,
    });

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    if (passwordConfirmation !== undefined && password !== passwordConfirmation) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const encryptedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        nickname: nickname.trim(),
        encryptedPassword,
      },
    });
    const accessToken = createAccessToken(user);

    return res.status(201).json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
    }

    return next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "이메일과 비밀번호를 입력해 주세요." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "이메일을 확인해 주세요." });
    }

    const isPasswordValid = await comparePassword(
      password,
      user.encryptedPassword,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호를 확인해 주세요." });
    }

    const accessToken = createAccessToken(user);

    return res.json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    return next(err);
  }
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

router.post(ENDPOINTS.AUTH_SIGN_UP, signUp);
router.post(ENDPOINTS.AUTH_SIGN_IN, signIn);
router.get(ENDPOINTS.AUTH_ME, authenticate, getMe);

module.exports = router;
