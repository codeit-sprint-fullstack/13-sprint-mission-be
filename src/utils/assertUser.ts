// ============================================================
// req.user 타입 가드
// - verifyAccessToken 통과 후에도 타입상 optional이라 컨트롤러마다
//   반복되던 `if (!req.user) return res.status(401)...`를 대체
// ============================================================
import { AppError } from "../middlewares/errors.js";

interface MaybeAuthedRequest {
  user?: { userId: number };
}

export default function assertUser<T extends MaybeAuthedRequest>(
  req: T,
): asserts req is T & { user: { userId: number } } {
  if (!req.user) throw new AppError("인증 필요", 401);
}
