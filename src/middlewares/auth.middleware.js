import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Authorization 헤더 가져오기
    const authHeader = req.headers.authorization;

    // 헤더가 없는 경우
    if (!authHeader) {
      return res.status(401).json({
        message: "인증이 필요합니다.",
      });
    }

    // 2. Bearer 토큰 형식 확인
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "잘못된 토큰 형식입니다.",
      });
    }

    // 3. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. req에 사용자 정보 저장
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

export default authMiddleware;
