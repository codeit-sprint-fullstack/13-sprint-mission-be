import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middlewares/errorHandler.js";
import * as userRepository from "../repositories/user.repository.js";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = "1h";
const ACCESS_TOKEN_MAX_AGE_MS = 60 * 60 * 1000;

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
export function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

// 프론트(Next.js)가 /api rewrite로 같은 origin처럼 호출하므로 sameSite:"lax"로 충분함
function setAccessTokenCookie(res, accessToken) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });
}

// 요구사항(인증): "회원가입 API를 만들어 주세요.
// email, nickname, password 를 입력하여 회원가입을 진행합니다.
// password는 해싱해 저장합니다."
export const signUp = async (req, res, next) => {
  try {
    const { email, nickname, password, image } = req.body;

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
    const accessToken = generateAccessToken(user);
    setAccessTokenCookie(res, accessToken);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const isValid = await bcrypt.compare(password, user.encryptedPassword);
    if (!isValid) {
      throw new UnauthorizedError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    const accessToken = generateAccessToken(user);
    setAccessTokenCookie(res, accessToken);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};
