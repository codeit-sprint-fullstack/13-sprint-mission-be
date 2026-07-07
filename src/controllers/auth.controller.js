import prisma from "../../prisma/seed.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;

    // 1. 필수값 확인
    if (!email || !nickname || !password || !passwordConfirmation) {
      return res.status(400).json({
        message: "필수 정보를 모두 입력해주세요.",
      });
    }

    // 2. 비밀번호 확인
    if (password !== passwordConfirmation) {
      return res.status(400).json({
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // 3. 이메일 중복 확인
    const emailUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailUser) {
      return res.status(409).json({
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    // 4. 닉네임 중복 확인
    const nicknameUser = await prisma.user.findUnique({
      where: {
        nickname,
      },
    });

    if (nicknameUser) {
      return res.status(409).json({
        message: "이미 사용 중인 닉네임입니다.",
      });
    }

    // 5. 비밀번호 암호화
    const encryptedPassword = await bcrypt.hash(password, 10);

    // 6. 회원 생성
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword,
      },
    });

    // 7. 비밀번호 제외
    const { encryptedPassword: _, ...result } = user;

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. 필수값 확인
    if (!email || !password) {
      return res.status(400).json({
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    // 2. 사용자 조회
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // 3. 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.encryptedPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // 4. JWT 발급
    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    // 5. refreshToken 발급
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. 비밀번호 제거
    const { encryptedPassword, ...userInfo } = user;

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: userInfo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // 1. 필수값 확인
    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh Token이 필요합니다.",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    // 2. 사용자 조회
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "존재하지 않는 사용자입니다.",
      });
    }
    // 3. 토큰 조회
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
