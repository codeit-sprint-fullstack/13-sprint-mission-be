import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import type { User } from "@prisma/client";
import { createError } from "../../utils/httpError";
import userRepository from "./userRepository";

const SALT_ROUNDS = 10;

interface SignupInput {
  email: string;
  nickname: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const generateTokens = (userId: string): TokenPair => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const userService = {
  async signup({ email, nickname, password }: SignupInput): Promise<User> {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw createError("이미 사용 중인 이메일입니다.", 409);

    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return userRepository.create({ id: nanoid(), email, nickname, encryptedPassword });
  },

  async getUser(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw createError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) throw createError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    return user;
  },

  async getUserById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  },

  async login(userId: string): Promise<TokenPair> {
    const { accessToken, refreshToken } = generateTokens(userId);
    await userRepository.updateRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  },

  async refresh(userId: string, refreshToken: string | null): Promise<TokenPair> {
    const user = await userRepository.findById(userId);
    if (!user) throw createError("인증이 필요합니다.", 401);

    if (user.refreshToken !== refreshToken) {
      throw createError("일치하는 토큰이 존재하지 않습니다.", 401);
    }

    const tokens = generateTokens(userId);
    await userRepository.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  },

  async logout(userId: string): Promise<void> {
    await userRepository.updateRefreshToken(userId, null);
  },
};

export default userService;
