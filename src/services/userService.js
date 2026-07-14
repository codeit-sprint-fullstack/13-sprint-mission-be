import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";

function hashPassword(encryptedpassword) {
  return bcrypt.hash(encryptedpassword, 10);
}

async function verifyPassword(inputPassword, encryptedpassword) {
  const isMatch = await bcrypt.compare(inputPassword, encryptedpassword);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
}

function createToken(user, type) {
  const payload = { userId: user.id };
  const isRefreshToken = type === "refreshToken";
  const secret = isRefreshToken
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_ACCESS_SECRET;
  const token = jwt.sign(payload, secret, {
    expiresIn: isRefreshToken ? "2w" : "1h",
  });
  return token;
}

async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("접근 권한이 업습니다");
    error.code = 401;
    throw error;
  }
  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refreshToken");
  return { newAccessToken, newRefreshToken };
}

function filterSensitiveUserData(user) {
  const { encryptedpassword, refreshToken, ...rest } = user;
  return rest;
}

async function createUser(user) {
  try {
    const hasUser = await userRepository.findByEmail(user.email);
    if (hasUser) {
      const error = new Error("이미 존재하는 유저입니다.");
      error.code = 409;
      error.data = { email: user.email };
      throw error;
    }
    const hashedPassword = await hashPassword(user.encryptedpassword);
    const createdUser = await userRepository.save({
      ...user,
      encryptedpassword: hashedPassword,
    });
    return filterSensitiveUserData(createdUser);
  } catch (error) {
    if (error.code === 409) throw error;

    const customError = new Error("데이트베이스 작업 중 오류가 발생했습니다.");
    customError.code = 500;
    throw customError;
  }
}

async function getUser(email, encryptedpassword) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일 입니다");
      error.code = 401;
      throw error;
    }
    await verifyPassword(encryptedpassword, user.encryptedpassword);
    return filterSensitiveUserData(user);
  } catch (error) {
    if (error.code === 401) throw error;

    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

async function updateUser(id, data) {
  const updateUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updateUser);
}

async function getMe(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("존재하지 않는 유저입니다");
    error.code = 404;
    throw error;
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
