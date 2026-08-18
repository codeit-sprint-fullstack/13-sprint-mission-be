import { Article } from "@prisma/client";
import { z } from "zod";
import { articleQuerySchema } from "../schemas/article.schemas.js";

export type ArticleQuery = z.infer<typeof articleQuerySchema>;

export type ArticleInput = Pick<Article, "images" | "title" | "content">;
