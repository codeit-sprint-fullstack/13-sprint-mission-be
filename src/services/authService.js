import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authRepository from "../repositories/authRepository.js";

function createToken(payload, type = "access") {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "access" ? "1h" : "1w",
  });
}
async function hashPassword(plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, 10);
}
function filterSensitiveUserData(userData) {
  const { password, ...rest } = userData;
  return rest;
}

async function createUser(userData) {
  const { name, email, username, password, passwordConfirmation } = userData;
  if (!name || !email || !username || !password || !passwordConfirmation)
    throw createError(
      400,
      "name, email, username, password, passwordConfirmation은 필수 값입니다.",
    );
  if (password !== passwordConfirmation)
    throw createError(400, "비밀번호와 비밀번호 확인이 일치하지 않습니다.");

  const hashedPassword = await hashPassword(password);
  const createdUser = await authRepository.create({
    name,
    email,
    username,
    password: hashedPassword,
  });
  const filteredUser = filterSensitiveUserData(createdUser);

  const accessToken = createToken(filteredUser, "access");
  const refreshToken = createToken(filteredUser, "refresh");
  return { ...filteredUser, accessToken, refreshToken };
}

async function signIn(userData) {
  const { id, password } = userData;
  if (!id || !password)
    throw createError(400, "id와 password는 필수 값입니다.");

  const userCheckedByEmail = await authRepository.findByEmail(id);
  const userCheckedByUsername = await authRepository.findByUsername(id);
  const user = userCheckedByEmail || userCheckedByUsername;
  const filteredUser = filterSensitiveUserData(user);
  if (!user) throw createError(401, "존재하지 않는 사용자입니다.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "비밀번호가 일치하지 않습니다");

  const accessToken = createToken(filteredUser, "access");
  const refreshToken = createToken(filteredUser, "refresh");
  return { ...filteredUser, accessToken, refreshToken };
}

export default { createUser, signIn };
