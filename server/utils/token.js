const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRES_IN = "1h";

const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    const error = new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
    error.statusCode = 500;
    throw error;
  }

  return jwtSecret;
};

const createAccessToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    },
    getJwtSecret(),
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );

const verifyAccessToken = (accessToken) => jwt.verify(accessToken, getJwtSecret());

module.exports = {
  createAccessToken,
  verifyAccessToken,
  getJwtSecret,
};
