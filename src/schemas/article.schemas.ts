// ============================================
// Article Zod 스키마
// ============================================

import { z } from "zod";

/** 게시글등록 스키마
 * @ image, title, content
 */
export const createArticleSchema = z.object({
  images: z
    .array(z.url({ message: "유효한 이미지 URL을 입력해주세요." }))
    .max(3, { message: "이미지는 최대 3개까지 등록할 수 있습니다." }),
  title: z
    .string()
    .min(1, "title은 1자 이상이어야 합니다")
    .max(100, "title은 100자 이내로 입력해주세요")
    .trim(),
  content: z.string().min(1, "content는 1자 이상이어야 합니다").trim(),
});

/** 게시글수정 스키마
 * @ image, title, content
 */
export const updateArticleSchema = createArticleSchema.partial();

/** 게시글 목록 조회 쿼리 스키마
 * @ page, pageSize, search, order
 */
export const articleQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional(),
  order: z.string().optional(),
});
