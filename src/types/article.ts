import { Article } from "@prisma/client";

export interface ArticleQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  order?: string;
}

export type ArticleInput = Pick<Article, "images" | "title" | "content">;
