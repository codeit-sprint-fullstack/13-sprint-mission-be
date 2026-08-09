import { Request } from "express";

// express-jwt(verifyAccessToken/optionalAuthenticate)가 req.auth에 심어주는 JWT payload 모양을 명시
export interface AuthPayload {
  userId: number;
}

// verifyAccessToken 미들웨어를 통과한 뒤에는 req.auth가 항상 채워져 있음을 보장하는 타입
// (라우터에서 verifyAccessToken을 거친 핸들러에서만 사용)
export interface AuthenticatedRequest extends Request {
  auth: AuthPayload;
}
