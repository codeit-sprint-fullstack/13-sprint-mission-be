// ============================================================
// Auth Service
// ============================================================
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Prisma, User } from "@prisma/client";
import { AppError } from "../middlewares/errors.js";
import authRepository from "../repositories/auth.repository.js";

/** 해싱된 패스워드 함수 */
function hashPassword(password: User["password"]) {
  return bcrypt.hash(password, 10);
}

/** 패스워드, 갱신 토큰을 제외한 사용자 데이터 추출 함수 */
function filterSensitiveUserData(user: User) {
  const { password, refreshToken, ...filteredData } = user;
  return filteredData;
}

/** 비밀번호 비교 함수 */
async function verifyPassword(
  inputPassword: User["password"],
  password: User["password"],
) {
  const isMatch = await bcrypt.compare(inputPassword, password);

  if (!isMatch) {
    throw new AppError("비밀번호가 일치하지 않습니다.", 401);
  }
}

/** 회원가입 서비스 로직 */
async function signup(user: Pick<User, "email" | "nickname" | "password">) {
  const existedUser = await authRepository.findByEmail(user.email);

  if (existedUser) {
    throw new AppError("이미 존재하는 사용자입니다.", 409);
  }

  const hashedPassword = await hashPassword(user.password);

  const createdUser = await authRepository.create({
    ...user,
    password: hashedPassword,
  });

  return filterSensitiveUserData(createdUser);
}

/** 사용자 정보 조회 서비스 로직 */
async function getUser(email: User["email"], password: User["password"]) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new AppError("존재하지 않는 이메일입니다.", 401);
  }

  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

/** 사용자 정보 업데이트 서비스 로직 */
async function updateUser(id: User["id"], data: Prisma.UserUpdateInput) {
  const updatedUser = await authRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
}

/** 토큰 생성 서비스 로직 */
function createToken(id: User["id"], type?: "access" | "refresh") {
  const payload = { userId: id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

/** 토큰 갱신 서비스 로직 */
async function refreshToken(
  userId: User["id"],
  refreshToken: User["refreshToken"],
) {
  const user = await authRepository.findById(userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("갱신 토큰이 만료되었습니다.", 401);
  }

  const newAccessToken = createToken(user.id);
  const newRefreshToken = createToken(user.id, "refresh");

  await authRepository.update(userId, { refreshToken: newRefreshToken });

  return { newAccessToken, newRefreshToken };
}

export default { signup, getUser, updateUser, createToken, refreshToken };
