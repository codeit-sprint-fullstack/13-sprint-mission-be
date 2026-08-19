import z from "zod";

export const listQuerySchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  limit: z.coerce.number().optional(),
  orderBy: z.enum(["recent", "like", "favorite"]).default("recent"),
  keyword: z.string().optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;
