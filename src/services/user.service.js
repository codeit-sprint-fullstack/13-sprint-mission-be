// ============================================================
// User Service
// ============================================================
import userRepository from "../repositories/user.repository.js";

async function getById(id) {
  return await userRepository.findById(id);
}

export default {
  getById,
};
