import jwt, { type SignOptions } from "jsonwebtoken";
import type { User } from "@prisma/client";

const SECRET = process.env.JWT_SECRET;
// jsonwebtoken의 expiresIn은 숫자 또는 "7d" 같은 ms 문자열 리터럴만 허용하므로,
// 환경 변수(일반 string)를 그 타입으로 명시적으로 좁혀준다.
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export interface JwtPayload {
  userId: number;
}

export function createToken(user: Pick<User, "id">): string {
  return jwt.sign({ userId: user.id }, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
