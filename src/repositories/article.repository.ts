import { prisma } from "./prisma.repository";
import type { Prisma } from "@prisma/client";
import type {
  ArticleCreateData,
  ArticleUpdateData,
  ArticleWithRelations,
  SortOrder,
} from "../types/domain";

const include = {
  owner: true,
  likes: true,
} as const;

interface FindAllOptions {
  keyword?: string;
  orderBy?: SortOrder | string;
}

function findAll({ keyword, orderBy }: FindAllOptions = {}): Promise<
  ArticleWithRelations[]
> {
  const where: Prisma.ArticleWhereInput = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.article.findMany({
    where,
    include,
    orderBy:
      orderBy === "favorite"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" },
  });
}

function findById(id: string): Promise<ArticleWithRelations | null> {
  return prisma.article.findUnique({ where: { id }, include });
}

function create(data: ArticleCreateData): Promise<ArticleWithRelations> {
  return prisma.article.create({ data, include });
}

function update(
  id: string,
  data: ArticleUpdateData,
): Promise<ArticleWithRelations> {
  return prisma.article.update({ where: { id }, data, include });
}

function remove(id: string) {
  return prisma.article.delete({ where: { id } });
}

export { create, findAll, findById, remove, update };
