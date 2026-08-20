import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { UserRequestType, UserReturnType } from "../types/user.js";
import authRepository from "../repositories/authRepository.js";

function createToken(
  payload: UserReturnType,
  type: "access" | "refresh" = "access",
) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: type === "access" ? "1h" : "1w",
  });
}
async function hashPassword(plainTextPassword: string): Promise<string> {
  return await bcrypt.hash(plainTextPassword, 10);
}
function filterSensitiveUserData(userData: User): UserReturnType {
  const { password, ...rest } = userData;
  return rest;
}

async function createUser(userData: UserRequestType): Promise<UserReturnType> {
  const { name, email, username, password, passwordConfirmation } = userData;
  if (!name || !email || !username || !password || !passwordConfirmation)
    throw createError(
      400,
      "name, email, username, password, passwordConfirmation은 필수 값입니다.",
    );
  if (password !== passwordConfirmation)
    throw createError(400, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
  const existedEmailUser = await authRepository.findByEmail(email);
  const existedUsernameUser = await authRepository.findByUsername(username);
  if (existedEmailUser || existedUsernameUser)
    throw createError(409, "이미 존재하는 유저입니다.");

  const hashedPassword = await hashPassword(password);
  const createdUser = await authRepository.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  return createdUser;
}

async function signIn(userData: {
  id: User["username"] | User["email"]; //둘다 string이지만 들어올 수 있는 값 명시하기 위해 union함
  password: User["password"];
}): Promise<UserReturnType> {
  const { id, password } = userData;
  if (!id || !password)
    throw createError(400, "id와 password는 필수 값입니다.");

  const userCheckedByEmail = await authRepository.findByEmail(id);
  const userCheckedByUsername = await authRepository.findByUsername(id);
  const user = userCheckedByEmail || userCheckedByUsername;
  if (!user) throw createError(401, "존재하지 않는 사용자입니다.");

  const filteredUser = filterSensitiveUserData(user);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "비밀번호가 일치하지 않습니다");

  return filteredUser;
}

export default { createToken, createUser, signIn };
