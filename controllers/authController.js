import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

function createAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function serializeUser(user) {
  return { id: user.id, email: user.email, nickname: user.nickname };
}

export async function signUp(req, res) {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;
    if (!email || !nickname || !password) return res.status(400).json({ message: '필수 항목을 입력해 주세요.' });
    if (password !== passwordConfirmation) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    res.status(201).json({ accessToken: createAccessToken(user.id), user: serializeUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    res.json({ accessToken: createAccessToken(user.id), user: serializeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
