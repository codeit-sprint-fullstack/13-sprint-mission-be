import type { User } from "@prisma/client";

// requireAuth/optionalAuth 미들웨어가 인증된 사용자를 req.user에 붙이므로
// Express의 Request 타입을 확장해 컨트롤러에서 바로 사용할 수 있게 한다.
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
