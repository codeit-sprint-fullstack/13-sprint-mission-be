import type { User } from "@prisma/client";
import type { UserRequestType, UserReturnType } from "../types/user.js";
import prisma from "../config/prisma.js";

// create 로직은 유저 정보 조회 목적으로 쓰이지 않으니
// Repository 단위에서 자체적으로 password 정보 omit
async function create(user: UserRequestType): Promise<UserReturnType> {
  const createdUser = await prisma.user.create({
    data: user,
    omit: {
      password: true,
    },
  });
  return createdUser;
}

// password 포함 유저 정보가 필요할 수도 있으니
// Repository 단위에서는 omit하지 않고 Service 차원에서 걸러내기
async function findById(userId: User["id"]): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

async function findByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

async function findByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
}

export default { create, findById, findByEmail, findByUsername };
