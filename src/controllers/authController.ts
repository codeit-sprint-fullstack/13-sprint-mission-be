import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export type SignUpDto = { email: string; nickname: string; password: string };
export type SignInDto = { email: string; password: string };

export const authController = {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, nickname, password } = req.body;

      if (!email || !nickname || !password) {
        return res
          .status(400)
          .json({ success: false, message: "모든 필드를 입력해 주세요." });
      }

      const result = await authService.signUp({ email, nickname, password });

      res.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "이메일과 비밀번호를 모두 입력해 주세요.",
          });
      }

      const result = await authService.signIn({ email, password });

      res.status(200).json({
        success: true,
        message: "로그인에 성공했습니다.",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
};
