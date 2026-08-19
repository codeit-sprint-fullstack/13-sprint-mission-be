import z from "zod";

export const signUpSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  nickName: z.string().min(1, "닉네임을 입력해주세요."),
  encryptedpassword: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export const loginSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다."),
  encryptedpassword: z.string().min(1, "비밀번호를 입력해주세요."),
});
