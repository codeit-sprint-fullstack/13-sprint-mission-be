import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRepository from "./auth.repository.js";

function createToken(user, type) {
  const payload = {
    userId: user.id,
    tokenType: type === "refresh" ? "refresh" : "access",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });
  return token;
}

function throwError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function filterSensitiveUserData(user) {
  const { encryptedPassword, refreshToken, ...rest } = user;
  return rest;
}

async function createAuthResult(user) {
  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refresh");
  await authRepository.updateRefreshToken(user.id, refreshToken);
  return {
    accessToken,
    refreshToken,
    user: filterSensitiveUserData(user),
  };
}

async function verifyPassword(inputPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isMatch) {
    throwError(401, "이메일 또는 비밀번호가 일치하지 않습니다.");
  }
}

async function signUp({ email, nickname, password }) {
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    throwError(409, "이미 사용 중인 이메일입니다.");
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  const createdUser = await authRepository.create({
    email,
    nickname,
    encryptedPassword,
  });
  return createAuthResult(createdUser);
}

async function signIn({ email, password }) {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throwError(401, "이메일 또는 비밀번호가 일치하지 않습니다.");
  }
  await verifyPassword(password, user.encryptedPassword);
  return createAuthResult(user);
}

async function getUserById(id) {
  const user = await authRepository.findById(id);
  if (!user) {
    return user;
  }
  return filterSensitiveUserData(user);
}

async function refreshAuthToken(userId, currentRefreshToken) {
  const user = await authRepository.findById(userId);
  if (!user || user.refreshToken !== currentRefreshToken) {
    throwError(401, "Unauthorized");
  }
  const { accessToken, refreshToken: newRefreshToken } =
    await createAuthResult(user);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export default {
  signUp,
  signIn,
  getUserById,
  refreshAuthToken,
};
