const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createId } = require("../repositories/database");
const usersRepository = require("../repositories/usersRepository");
const { HttpError } = require("../middlewares/error");
const {
  jwtSecret,
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/auth");
const { publicUser } = require("./presenters");
const { match } = require("path-to-regexp");

function authResponse(user) {
  return {
    user: publicUser(user),
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

async function signUp({ email, nickname, password }) {
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

async function signIn({ email, password }) {
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

async function refresh(refreshToken) {
  try {
    const payload = jwt.verify(refreshToken, jwtSecret);
    if (payload.type !== "refresh") throw new Error("invalid");
    const user = await usersRepository.findById(payload.sub);
    if (!user) throw new Error("invalid");
    return {
      accessToken: signAccessToken(user),
      refreshToken: signRefreshToken(user),
    };
  } catch {
    throw new HttpError(401, "리프레시 토큰이 유효하지 않습니다.");
  }
}

module.exports = { refresh, signIn, signUp };
