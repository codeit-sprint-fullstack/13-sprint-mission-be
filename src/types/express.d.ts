import { AuthPayload } from "./auth.js";

// 요구사항: declare로 Express 타입 확장
declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      // TODO: Passport/OAuth 붙이면 req.user?: PrismaUser 여기에 추가
    }
  }
}
