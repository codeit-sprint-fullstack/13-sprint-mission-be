import { z } from "zod";

// 요구사항(인증): "회원가입 API를 만들어 주세요.
// email, nickname, password 를 입력하여 회원가입을 진행합니다."
export const signUpSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  nickname: z
    .string()
    .min(1, "닉네임을 입력해 주세요.")
    .max(20, "닉네임은 20자 이내여야 합니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  image: z.string().url("올바른 이미지 URL이 아닙니다.").optional(),
});

// 요구사항(인증): "로그인 API를 만들어 주세요.
// 사용자의 신원을 확인하고, 성공적인 인증 후에는 액세스 토큰을 발급해 반환합니다."
export const signInSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});
