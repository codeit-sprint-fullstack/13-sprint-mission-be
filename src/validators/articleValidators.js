import { z } from "zod";

export const articleIdParamSchema = z.object({
  id: z.coerce.number({ error: "게시글 ID는 숫자여야 합니다." }).int().positive(),
});

export const articleListQuerySchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["recent", "like"]).optional(),
});

export const createArticleSchema = z.object({
  title: z.string({ error: "제목은 필수입니다." }).trim().min(1, "제목은 필수입니다."),
  content: z.string({ error: "내용은 필수입니다." }).trim().min(1, "내용은 필수입니다."),
  image: z.string().trim().url().optional(),
});

export const updateArticleSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional(),
    image: z.string().trim().url().optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    "수정할 내용이 하나라도 있어야 합니다."
  );
