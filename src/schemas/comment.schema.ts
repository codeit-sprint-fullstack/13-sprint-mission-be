import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, "댓글의 내용은 1자 이상이어야 합니다"),
});

export default createCommentSchema;

export const getCommentListQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  sort: z.enum(["recent"]).default("recent"),
  lastId: z.coerce.number().int().positive().optional(),
});
