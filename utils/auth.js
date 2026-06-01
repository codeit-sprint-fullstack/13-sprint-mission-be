import jwt from 'jsonwebtoken';

export function getAuthenticatedUserId(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: '인증이 필요합니다.' });
    return null;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.userId;
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    return null;
  }
}
