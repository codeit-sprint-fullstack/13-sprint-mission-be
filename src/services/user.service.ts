// ============================================================
// User Service
// ============================================================
import { User } from "@prisma/client";
import userRepository from "../repositories/user.repository.js";

async function getById(id: User["id"]) {
  return await userRepository.findById(id);
}

export default {
  getById,
};
