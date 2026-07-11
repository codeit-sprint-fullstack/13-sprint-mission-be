import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { createToken } from "../utils/jwt.js";
import { signUpSchema, signInSchema } from "../validators/authValidators.js";

function toPublicUser(user) {
  const { encryptedPassword, ...rest } = user;
  return rest;
}

export async function signUp(req, res) {
  const { email, nickname, password } = signUpSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "이미 가입된 이메일입니다." });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, nickname, encryptedPassword },
  });

  const accessToken = createToken(user);
  res.status(201).json({ user: toPublicUser(user), accessToken });
}

export async function signIn(req, res) {
  const { email, password } = signInSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const isMatch = await bcrypt.compare(password, user.encryptedPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const accessToken = createToken(user);
  res.status(200).json({ user: toPublicUser(user), accessToken });
}
