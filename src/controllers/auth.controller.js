// TODO:
const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { generateAccessToken } = require("../utils/jwt");
const { BadRequestError, UnauthorizedError } = require("../utils/customError");

const SALT_ROUNDS = 10;

// 회원가입
exports.signUp = asyncHandler(async (req, res) => {
  const { email, nickname, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new BadRequestError("이미 사용 중인 이메일입니다.");
  }

  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, nickname, encryptedPassword },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
  });
});

// 로그인
exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const isValid = await bcrypt.compare(password, user.encryptedPassword);
  if (!isValid) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const accessToken = generateAccessToken(user);

  res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
    },
  });
});
