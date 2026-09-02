import { Request, RequestHandler, Response } from "express";
import { CustomError } from "../utils/customError";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "../dtos/user.dto";
import { Request as JwtRequest } from "express-jwt";
import userService from "../services/user.service";

const createUser = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    throw new CustomError("이메일, 이름, 비밀번호 모두 필요합니다", 400);
  }

  const safeUserData = await userService.createUser({ email, name, password });
  res.status(201).json(safeUserData);
};

const loginUser = async (req: Request<{}, {}, LoginUserDto>, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("이메일, 비밀번호 모두 필요합니다", 400);
  }

  const result = await userService.loginUser({ email, password });
  res.status(200).json(result);
};

// express의 기본 Request엔 auth 필드가 없어서 express-jwt가 제공하는 Request<T> 사용
// T = { userId: number }: token.js에서 서명한 payload 모양과 일치 (User.id가 Int라서 number)
const getUser = async (req: JwtRequest<{ userId: number }>, res: Response) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }

  const safeUserData = await userService.getUser(req.auth.userId);
  res.status(200).json(safeUserData);
};

const refreshToken: RequestHandler = async (req, res): Promise<void> => {
  const { refreshToken }: RefreshTokenDto = req.body;
  if (!refreshToken) {
    throw new CustomError("리프레시 토큰이 필요합니다", 401);
  }

  const accessToken = await userService.refreshUserToken(refreshToken);
  res.json({ accessToken });
};

const logoutUser = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }

  await userService.logoutUser(req.auth.userId);
  res.status(200).json({ message: "로그아웃 되었습니다" });
};

export default { createUser, loginUser, getUser, refreshToken, logoutUser };
