import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

export const signInSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
