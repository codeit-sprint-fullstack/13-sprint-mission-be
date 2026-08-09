import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, "title은 1자 이상이어야 합니다")
    .max(100, "title은 100자 이하여야 합니다"),
  content: z.string().max(1000, "content는 1000자 이하여야 합니다"),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

// TODO: type UpdateArticleInput = {
//   title?: string;
//   content?: string;
// }; 이렇게 처음부터 적으면 될일 아닌가? 
