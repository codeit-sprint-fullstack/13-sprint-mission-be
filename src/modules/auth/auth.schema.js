import * as z from "zod";

export const signUpSchema = z
  .object({
    nickname: z.string().min(1, "닉네임을 입력해 주세요."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호가 8자 이상이 되도록 해 주세요."),
    passwordConfirmation: z.string().min(1, "비밀번호 확인은 필수입니다."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirmation"],
  });

export const signInSchema = z.object({
  email: z.email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});
