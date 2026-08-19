import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { signUpSchema, signInSchema } from "../dto/auth.dto";
import { success } from "zod";

export const authController = {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = signUpSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        return res.status(400).json({ success: false, message: errorMessage });
      }

      const { email, nickname, password } = validationResult.data;

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
      const validationResult = signInSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        return res.status(400).json({ success: false, message: errorMessage });
      }

      const { email, password } = validationResult.data;

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
