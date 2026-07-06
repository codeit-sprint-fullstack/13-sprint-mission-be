import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
} from "../middlewares/errorHandler.js";
import * as userRepository from "../repositories/user.repository.js";

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = "1h";

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
export function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
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

    res.status(201).json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
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

    res.status(200).json({
      accessToken,
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
