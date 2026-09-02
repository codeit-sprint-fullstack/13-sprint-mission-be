import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "게시글의 제목은 1자 이상이어야 합니다"),
  content: z.string().min(5, "게시글 내용은 5자 이상이어야 합니다"),
});

export const updateArticleSchema = createArticleSchema.partial();

export const getArticleListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  sort: z.enum(["recent", "like"]).default("recent"),
  keyword: z.string().default(""),
});
