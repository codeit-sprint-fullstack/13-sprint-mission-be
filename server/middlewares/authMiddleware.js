const { expressjwt } = require("express-jwt");
const prisma = require("../lib/prisma");
const { getJwtSecret } = require("../utils/token");

const verifyJwt = expressjwt({
  secret: () => getJwtSecret(),
  algorithms: ["HS256"],
});

const optionalVerifyJwt = expressjwt({
  secret: () => getJwtSecret(),
  algorithms: ["HS256"],
  credentialsRequired: false,
});

const attachUser = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

const authenticate = [verifyJwt, attachUser];
const optionalAuthenticate = [optionalVerifyJwt, attachUser];

module.exports = {
  authenticate,
  optionalAuthenticate,
};
