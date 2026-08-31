import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import type { PublicUser } from "../types/auth";

function toPublicUser(user: User): PublicUser {
  const { encryptedPassword, ...rest } = user;
  return rest;
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.status(200).json(toPublicUser(req.user!));
}
