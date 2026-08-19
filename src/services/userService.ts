import type { User } from "@prisma/client";
import userRepository from "../repositories/userRepository.js";

async function getUserDetail(userId: User["id"]) {
  return await userRepository.find(userId);
}

export default { getUserDetail };
