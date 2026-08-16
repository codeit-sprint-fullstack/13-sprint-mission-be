import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string({ error: "이메일은 필수입니다." })
      .trim()
      .email("이메일 형식이 올바르지 않습니다."),
    nickname: z
      .string({ error: "닉네임은 필수입니다." })
      .trim()
      .min(1, "닉네임은 필수입니다."),
    password: z
      .string({ error: "비밀번호는 필수입니다." })
      .min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirmation: z
      .string({ error: "비밀번호 확인은 필수입니다." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirmation"],
  });

export const signInSchema = z.object({
  email: z
    .string({ error: "이메일은 필수입니다." })
    .trim()
    .email("이메일 형식이 올바르지 않습니다."),
  password: z
    .string({ error: "비밀번호는 필수입니다." })
    .min(1, "비밀번호는 필수입니다."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
