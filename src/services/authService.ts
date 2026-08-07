import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../models/prismaClient";
import { AppError } from "../middlewares/errorHandler";
import { SignUpDto, SignInDto } from "../dto/auth.dto";
import { from } from "node:stream/iter";

const JWT_SECRET = process.env.JWT_SECRET || "panda-market-secret-key-1234";

export const authService = {
  signUp: async (dto: SignUpDto) => {
    const { email, nickname, password } = dto;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error: AppError = new Error("이미 사용 중인 이메일입니다.");
      error.statusCode = 400;
      throw error;
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      createdAt: newUser.createdAt,
    };
  },

  signIn: async (dto: SignInDto) => {
    const { email, password } = dto;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error: AppError = new Error("이메일을 확인해 주세요.");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.encryptedPassword,
    );
    if (!isPasswordValid) {
      const error: AppError = new Error("비밀번호를 확인해 주세요.");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    };
  },
};
