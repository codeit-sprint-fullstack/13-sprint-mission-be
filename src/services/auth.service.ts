import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../middlewares/error";
import {
  jwtSecret,
  signAccessToken,
  signRefreshToken,
} from "../middlewares/auth";
import { createId } from "../repositories/prisma.repository";
import * as usersRepository from "../repositories/user.repository";
import { publicUser } from "../utils/presenter.util";
import type { AuthBody, AuthUser } from "../types/domain";

function authResponse(user: AuthUser) {
  return {
    user: publicUser(user),
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

async function signUp({ email, nickname, password }: AuthBody) {
  if (!email || !nickname || !password) {
    throw new HttpError(400, "email, nickname, password를 모두 입력해주세요.");
  }
  if (await usersRepository.findByEmail(email)) {
    throw new HttpError(409, "이미 가입된 이메일입니다.");
  }
  const user = await usersRepository.create({
    id: createId("user"),
    email,
    nickname,
    image: "",
    encryptedPassword: await bcrypt.hash(password, 10),
  });
  return authResponse(user);
}

async function signIn({ email, password }: AuthBody) {
  const user = await usersRepository.findByEmail(email);
  if (!user)
    throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");

  let matched = false;
  if (user.encryptedPassword === "__DEMO_PASSWORD__") {
    matched = password === "password123";
    if (matched) {
      user.encryptedPassword = await bcrypt.hash(password, 10);
      await usersRepository.update(user.id, {
        encryptedPassword: user.encryptedPassword,
      });
    }
  } else {
    matched = await bcrypt.compare(password, user.encryptedPassword);
  }

  if (!matched)
    throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  return authResponse(user);
}

async function refresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, jwtSecret);
    if (typeof payload === "string" || payload.type !== "refresh") {
      throw new Error("invalid");
    }
    const userId = typeof payload.sub === "string" ? payload.sub : "";
    const user = await usersRepository.findById(userId);
    if (!user) throw new Error("invalid");
    return {
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    };
  } catch {
    throw new HttpError(401, "리프레시 토큰이 유효하지 않습니다.");
  }
}

export { refresh, signIn, signUp };
