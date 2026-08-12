import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import HttpError from "../errors/HttpError.js";
import userRepository from "../repositories/userRepository.js";

function hashPassword(encryptedpassword: string) {
  return bcrypt.hash(encryptedpassword, 10);
}

async function verifyPassword(
  inputPassword: string,
  encryptedpassword: string,
) {
  const isMatch = await bcrypt.compare(inputPassword, encryptedpassword);
  if (!isMatch) {
    throw new HttpError("비밀번호가 일치하지 않습니다.", 401);
  }
}

function createToken(user: { id: number }, type?: "refreshToken") {
  const payload = { userId: user.id };
  const isRefreshToken = type === "refreshToken";
  const secret = isRefreshToken
    ? env.JWT_REFRESH_SECRET
    : env.JWT_ACCESS_SECRET;
  const token = jwt.sign(payload, secret, {
    expiresIn: isRefreshToken ? "2w" : "1h",
  });
  return token;
}

async function refreshToken(userId: number, refreshToken: string) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new HttpError("접근 권한이 업습니다", 401);
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refreshToken");
  return { newAccessToken, newRefreshToken };
}

function filterSensitiveUserData(user: User) {
  const { encryptedpassword, refreshToken, ...rest } = user;
  return rest;
}

async function createUser(user: {
  email: string;
  nickName: string;
  encryptedpassword: string;
}) {
  const hasUser = await userRepository.findByEmail(user.email);
  if (hasUser) {
    throw new HttpError("이미 존재하는 유저입니다.", 409, {
      email: user.email,
    });
  }
  const hashedPassword = await hashPassword(user.encryptedpassword);
  const createdUser = await userRepository.save({
    ...user,
    encryptedpassword: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

async function getUser(email: string, encryptedpassword: string) {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.encryptedpassword) {
    throw new HttpError("존재하지 않는 이메일 입니다", 401);
  }
  await verifyPassword(encryptedpassword, user.encryptedpassword);
  return filterSensitiveUserData(user);
}

async function updateUser(id: number, data: Prisma.UserUncheckedUpdateInput) {
  const updateUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updateUser);
}

async function getMe(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new HttpError("존재하지 않는 유저입니다", 404);
  }
  return filterSensitiveUserData(user);
}

export default {
  createToken,
  refreshToken,
  updateUser,
  getUser,
  createUser,
  getMe,
};
