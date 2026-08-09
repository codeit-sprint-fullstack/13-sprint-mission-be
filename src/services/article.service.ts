import * as articleRepository from "../repositories/article.repository.js";
import { Prisma } from "../config/prisma.js";
import { NotFoundError } from "../middlewares/errorHandler.js";
import { CreateArticleInput, UpdateArticleInput } from "../schemas/article.schema.js";

// [ ]  게시글 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
export async function getArticle(id: number, userId?: number) {
  const article = await articleRepository.findById(id);
  if (!article) throw new NotFoundError("Article를 찾을 수 없습니다");
  const isLiked = userId ? await articleRepository.isLikedByUser(userId, id) : false;
  return { ...article, isLiked };
}

// [ ]  게시글 등록 API를 만들어 주세요.
// [ ] `title`, `content`를 입력해 게시글을 등록합니다.
export async function createArticle(input: CreateArticleInput, userId?: number) {
  return articleRepository.create({
    title: input.title,
    content: input.content,
    userId,
  });
}

// [ ]  게시글 수정 API를 만들어 주세요.
export async function updateArticle(id: number, data: UpdateArticleInput) {
  return articleRepository.update(id, data);
}

// [ ]  게시글 삭제 API를 만들어 주세요.
export async function deleteArticle(id: number) {
  await articleRepository.remove(id);
}

interface GetArticlesParams {
  search?: string;
  sort: string;
  page: number;
  limit: number;
}

// [ ]  게시글 목록 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  최신순(`recent`)으로 정렬할 수 있습니다.
// [ ] `title`, `content`에 포함된 단어로 검색할 수 있습니다.
export async function getArticles({ search, sort, page, limit }: GetArticlesParams) {
  const where: Prisma.ArticleWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderByMap: Record<string, Prisma.ArticleOrderByWithRelationInput> = {
    recent: { createdAt: "desc" },
  };
  const orderBy = orderByMap[sort] ?? { createdAt: "desc" };

  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    articleRepository.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    }),

    articleRepository.count({ where }),
  ]);

  return { articles, total };
}
