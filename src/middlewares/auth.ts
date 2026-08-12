// ============================================================
// Auth Middlewares
// - 인증/인가 미들웨어
// ============================================================
import { expressjwt } from "express-jwt";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");

/** 엑세스 토큰 미들웨어 */
const verifyAccessToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

/** 옵셔널 엑세스 토큰 미들웨어
 * - 로그인 여부와 무관하게 접근 가능한 라우트에서,
 * 토큰이 있으면 req.user를 채워주는 선택적 인증 */
const verifyAccessTokenOptional = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
  credentialsRequired: false, // 토큰이 없는 요청이 들어왔을 때, 통과 하는 옵션
});

/** 토큰 갱신 미들웨어 */
const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
  getToken: (req) => req.cookies.refreshToken,
});

export default {
  verifyAccessToken,
  verifyAccessTokenOptional,
  verifyRefreshToken,
};
