const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  nickname: z
    .string()
    .min(1, "닉네임을 입력해 주세요.")
    .max(20, "닉네임은 20자 이내여야 합니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

module.exports = { registerSchema, loginSchema };
