import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { createError } from "#/utils/httpError.js";
import userRepository from "#/repository/userRepository.js";

const SALT_ROUNDS = 10;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const userService = {
  async signup({ email, nickname, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw createError("이미 사용 중인 이메일입니다.", 409);

    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return userRepository.create({ id: nanoid(), email, nickname, encryptedPassword });
  },

  async getUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw createError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) throw createError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    return user;
  },

  async getUserById(id) {
    return userRepository.findById(id);
  },

  async login(userId) {
    const { accessToken, refreshToken } = generateTokens(userId);
    await userRepository.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  },

  async refresh(userId) {
    const { accessToken, refreshToken } = generateTokens(userId);
    await userRepository.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  },

  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null);
  },
};

export default userService;
