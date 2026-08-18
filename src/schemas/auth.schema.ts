// ============================================
// Auth Zod 스키마
// ============================================
import { z } from "zod";

/** 회원가입 스키마
 * @ email, nickname, password
 */
export const signUpSchema = z.object(
  {
    email: z
      .email("이메일 형식이 올바르지 않습니다")
      .trim()
      .min(1, "이메일을 입력해주세요")
      .max(254, "이메일은 254자 이하여야 합니다.")
      .pipe(z.email("올바른 이메일 형식이 아닙니다.")),
    nickname: z
      .string("nickname은 필수 값 입니다.")
      .trim()
      .min(2, "닉네임은 2자 이상이어야 합니다.")
      .max(12, "닉네임은 12자 이하여야 합니다.")
      .regex(
        /^[a-zA-Z0-9가-힣]+$/,
        "닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.",
      ),
    password: z
      .string("password는 필수 값 입니다.")
      .trim()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(64, "비밀번호는 64자 이하여야 합니다."),
  },
  { message: "요청 본문이 올바르지 않습니다." },
);

/** 이메일, 비밀번호 인증 스키마
 * @ email, password
 */
export const validateEmailAndPasswordSchema = z.object({
  email: z
    .email("이메일 형식이 올바르지 않습니다")
    .trim()
    .min(1, "이메일을 입력해주세요")
    .max(254, "이메일은 254자 이하여야 합니다.")
    .pipe(z.email("올바른 이메일 형식이 아닙니다.")),

  password: z
    .string("password는 필수 값 입니다.")
    .trim()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(64, "비밀번호는 64자 이하여야 합니다."),
});
