import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createToken from "../utils/token";
import { CustomError } from "../utils/customError";
import userRepository from "../repositories/user.repository";
import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";

const createUser = async ({ email, name, password }: CreateUserDto) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = await userRepository.create({
    email,
    nickname: name,
    encryptedPassword: hashedPassword,
  });

  const { encryptedPassword, ...safeUserData } = userData;
  return safeUserData;
};

const loginUser = async ({ email, password }: LoginUserDto) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new CustomError("등록된 이메일이 아닙니다", 401);
  }

  const isMatch = await bcrypt.compare(password, user.encryptedPassword!);
  if (!isMatch) {
    throw new CustomError("등록된 비밀번호가 아닙니다", 401);
  }

  const refreshToken = createToken(user.id, "refresh");
  await userRepository.updateRefreshToken(user.id, refreshToken);

  const accessToken = createToken(user.id);
  //기존의 리프레쉬토큰 제외
  const {
    encryptedPassword,
    refreshToken: _refreshToken,
    ...safeUserData
  } = user;
  return { userData: safeUserData, accessToken, refreshToken };
};

const getUser = async (userId: number) => {
  const userData = await userRepository.findById(userId);
  if (!userData) {
    throw new CustomError("해당 유저를 찾을 수 없습니다", 404);
  }
  const { encryptedPassword, refreshToken, ...safeUserData } = userData;
  return safeUserData;
};

const refreshUserToken = async (refreshToken: string) => {
  //토큰을 디코딩하면 나의 경우 객체가 나옴
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
  //createToken에서 payload={userId:user.id}를 만들 때 Prisma Int필드라 JS에서도 number 타입이고 JSON으로 직렬화 될 때 userId:3 과 같이 숫자로 저장된다
  if (typeof decoded === "string" || typeof decoded.userId !== "number") {
    throw new CustomError("유효하지 않은 토큰입니다.", 401);
  }

  const user = await userRepository.findById(decoded.userId);
  if (!user) {
    throw new CustomError("해당 유저를 찾을 수 없습니다", 404);
  }
  if (user.refreshToken !== refreshToken) {
    throw new CustomError("유효한 리프레시 토큰이 아닙니다.", 401);
  }

  return createToken(user.id);
};

const logoutUser = async (userId: number) => {
  await userRepository.updateRefreshToken(userId, null);
};

export default {
  createUser,
  loginUser,
  getUser,
  refreshUserToken,
  logoutUser,
};
