import userRepository from "../repositories/userRepository.js";

async function getUserDetail(userId) {
  return await userRepository.find(userId);
}

export default { getUserDetail };
