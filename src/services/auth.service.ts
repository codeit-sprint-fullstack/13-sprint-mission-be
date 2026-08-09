import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middlewares/errorHandler.js";
import * as userRepository from "../repositories/user.repository.js";
import redis from "../config/redis.js";
import { JWT_SECRET } from "../config/env.js";
import { SignUpInput, SignInInput } from "../schemas/auth.schema.js";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = "1h";

// 요구사항(심화 - 인증): "만료된 액세스 토큰을 새로 발급하는 리프레시 토큰 발급 기능을
// 구현합니다. (jwt sliding session 적용)"
// -> refresh token은 7일짜리로 발급하고, 매 갱신(/auth/refresh)마다 새 토큰으로 교체 +
//    Redis의 만료시간도 다시 7일로 늘려서 계속 활동하는 사용자는 로그인이 끊기지 않게 함
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

interface AuthUser {
  id: number;
}

interface RefreshTokenPayload {
  userId: number;
  jti: string;
  type: "refresh";
}

// 기기별로 동시에 여러 세션이 살아있을 수 있게 jti(세션 id)로 구분해서 저장
const refreshTokenKey = (userId: number, jti: string) => `refreshToken:${userId}:${jti}`;

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
function generateAccessToken(user: AuthUser) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(user: AuthUser, jti: string) {
  return jwt.sign(
    { userId: user.id, jti, type: "refresh" },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  );
}

// accessToken + refreshToken을 함께 발급하고, refreshToken은 Redis에 화이트리스트로 등록
// (여기 등록된 것만 유효한 refreshToken으로 취급 -> 로그아웃/탈취 시 즉시 무효화 가능)
async function issueTokens(user: AuthUser) {
  const jti = crypto.randomUUID();
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  await redis.set(
    refreshTokenKey(user.id, jti),
    "1",
    "EX",
    REFRESH_TOKEN_TTL_SECONDS,
  );

  return { accessToken, refreshToken };
}

// 요구사항(인증): "회원가입 API를 만들어 주세요.
// email, nickname, password 를 입력하여 회원가입을 진행합니다.
// password는 해싱해 저장합니다."
export async function signUp(input: SignUpInput) {
  const { email, nickname, password, image } = input;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new BadRequestError("이미 사용 중인 이메일입니다.");
  }

  // password는 해싱해 저장 (bcrypt)
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepository.create({
    email,
    nickname,
    encryptedPassword,
    image,
  });

  // 요구사항: 회원가입 성공 시 바로 로그인된 상태가 되어야 함(프론트가 가입 직후 자동 로그인을 기대함)
  const tokens = await issueTokens(user);
  return { user, tokens };
}

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
export async function signIn(input: SignInInput) {
  const { email, password } = input;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const isValid = await bcrypt.compare(password, user.encryptedPassword);
  if (!isValid) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const tokens = await issueTokens(user);
  return { user, tokens };
}

// 요구사항(심화 - 인증): "만료된 액세스 토큰을 새로 발급하는 리프레시 토큰 발급 기능을 구현합니다."
// -> refreshToken을 검증하고, Redis 화이트리스트에 있는지 확인한 뒤
//    (재사용 방지를 위해 기존 토큰은 폐기하고) accessToken/refreshToken을 새로 발급
export async function refreshAccessToken(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw new UnauthorizedError("refresh token이 없습니다.");
  }

  let payload: RefreshTokenPayload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError("refresh token이 유효하지 않습니다.");
  }
  if (payload.type !== "refresh") {
    throw new UnauthorizedError("refresh token이 유효하지 않습니다.");
  }

  const key = refreshTokenKey(payload.userId, payload.jti);
  const isValid = await redis.get(key);
  if (!isValid) {
    throw new UnauthorizedError("만료되었거나 이미 사용된 refresh token입니다.");
  }
  await redis.del(key);

  return issueTokens({ id: payload.userId });
}

// 요구사항(심화 - 인증) 연계: refresh token을 발급하는 이상, 탈취/기기 분실 시
// 해당 세션만 즉시 무효화할 수 있는 로그아웃 기능이 필요함
export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) return;
  // 만료된 토큰이라도 Redis 정리는 되어야 하므로 서명 검증 없이 payload만 확인
  const payload = jwt.decode(refreshToken) as RefreshTokenPayload | null;
  if (payload?.userId && payload?.jti) {
    await redis.del(refreshTokenKey(payload.userId, payload.jti));
  }
}
