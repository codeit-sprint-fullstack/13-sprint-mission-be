import { expressjwt } from "express-jwt";

// accessToken은 httpOnly 쿠키로 발급됨 (auth.controller.js) -> 쿠키에서 읽음
const getTokenFromCookie = (req) => req.cookies?.accessToken;

// 요구사항(상품/게시글/댓글 기능 인가): "로그인한 사용자만"
// -> accessToken 쿠키가 없거나 유효하지 않으면 401 (errorHandler에서 처리)
export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: getTokenFromCookie,
});

// 요구사항(상품 상세/좋아요): "사용자가 '좋아요'를 눌렀는지 여부를 확인할 수 있도록
// 응답 객체에 포함시켜 반환해 주세요." (isLiked)
// -> 토큰이 없으면 비로그인으로 통과, 있으면 검증 후 req.auth를 채워줌
export const optionalAuthenticate = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
  getToken: getTokenFromCookie,
});