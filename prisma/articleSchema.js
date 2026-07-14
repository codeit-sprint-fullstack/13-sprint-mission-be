import z from "zod";

export const articleCreateSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").max(30, "30자 이내로 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
  image: z.string().optional(),
});
