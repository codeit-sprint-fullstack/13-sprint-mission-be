import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import prisma from "../utils/prisma";
import { createToken } from "../utils/jwt";
import { signUpSchema, signInSchema } from "../validators/authValidators";
import type { PublicUser } from "../types/auth";

function toPublicUser(user: User): PublicUser {
  const { encryptedPassword, ...rest } = user;
  return rest;
}

export async function signUp(req: Request, res: Response): Promise<void> {
  const { email, nickname, password } = signUpSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ message: "이미 가입된 이메일입니다." });
    return;
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, nickname, encryptedPassword },
  });

  const accessToken = createToken(user);
  res.status(201).json({ user: toPublicUser(user), accessToken });
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const { email, password } = signInSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.encryptedPassword);
  if (!isMatch) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const accessToken = createToken(user);
  res.status(200).json({ user: toPublicUser(user), accessToken });
}
