import expressjwt from "express-jwt";

function verifyAccessToken() {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });
}

export default { verifyAccessToken };
