import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { SignUpInput, SignInInput } from "../schemas/auth.schema.js";

const ACCESS_TOKEN_MAX_AGE_MS = 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// 프론트(Next.js)가 /api rewrite로 같은 origin처럼 호출하므로 sameSite:"lax"로 충분함
function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
}

function toUserResponse(user: { id: number; email: string; nickname: string; image: string | null }) {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
  };
}

// 요구사항(인증): "회원가입 API를 만들어 주세요.
// email, nickname, password 를 입력하여 회원가입을 진행합니다.
// password는 해싱해 저장합니다."
// 요구사항: 회원가입 성공 시 바로 로그인된 상태가 되어야 함(프론트가 가입 직후 자동 로그인을 기대함)
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await authService.signUp(req.body as SignUpInput);
    setAuthCookies(res, tokens);
    res.status(201).json({ user: toUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

// 요구사항(인증): "로그인 API를 만들어 주세요. 사용자의 신원을 확인하고,
// 성공적인 인증 후에는 액세스 토큰을 발급해 response 객체에 포함해 반환합니다."
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await authService.signIn(req.body as SignInInput);
    setAuthCookies(res, tokens);
    res.status(200).json({ user: toUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

// 요구사항(심화 - 인증): "만료된 액세스 토큰을 새로 발급하는 리프레시 토큰 발급 기능을 구현합니다."
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokens = await authService.refreshAccessToken(req.cookies?.refreshToken);
    setAuthCookies(res, tokens);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 요구사항(심화 - 인증) 연계: refresh token을 발급하는 이상, 탈취/기기 분실 시
// 해당 세션만 즉시 무효화할 수 있는 로그아웃 기능이 필요함
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.cookies?.refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
