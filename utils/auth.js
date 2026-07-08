import jwt from 'jsonwebtoken';

function getBearerToken(req) {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : null;
}

export function getAuthenticatedUserId(req, res) {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).json({ message: '인증이 필요합니다.' });
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user?.userId) throw new Error('Missing user id');
    req.user = { id: user.userId };
    return user.userId;
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    return null;
  }
}

export function setOptionalAuthenticatedUser(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user?.userId) return null;
    req.user = { id: user.userId };
    return req.user.id;
  } catch {
    req.user = undefined;
    return null;
  }
}
