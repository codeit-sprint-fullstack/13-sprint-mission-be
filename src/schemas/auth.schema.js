// ============================================
// Auth Zod 스키마
// ============================================
import { z } from "zod";

/** 회원가입 스키마
 * @ email, nickname, password
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("이메일 형식이 올바르지 않습니다"),
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .regex(/^[a-zA-Z0-9가-힣]+$/, "닉네임은 특수문자를 사용할 수 없습니다")
    .trim(),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").trim(),
});

/** 이메일, 비밀번호 인증 스키마
 * @ email, password
 */
export const validateEmailAndPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("이메일 형식이 올바르지 않습니다"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").trim(),
});
