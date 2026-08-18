// ============================================================
// Article Repository
// ============================================================
import { Article, Prisma, User } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ArticleInput } from "../types/article.js";

/** 게시글 목록 조회
 * - 검색 / 정렬 / 페이지네이션 */
async function findAll({
  where,
  skip,
  take,
  orderBy,
}: Pick<Prisma.ArticleFindManyArgs, "where" | "skip" | "take" | "orderBy">) {
  const [data, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        owner: { select: { id: true, nickname: true, avatar: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { data, totalArticles };
}

/** 게시글 단건 조회
 * - 좋아요수 / 작성자 / 댓글 포함 */
async function findById(id: Article["id"]) {
  return await prisma.article.findUniqueOrThrow({
    where: { id },
    include: {
      owner: { select: { id: true, nickname: true, avatar: true } },
      articleComments: {
        include: {
          owner: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
}

/** 게시글 생성 */
async function create({
  data,
  userId,
}: {
  data: ArticleInput;
  userId: User["id"];
}) {
  return await prisma.article.create({
    data: {
      ...data,
      owner: { connect: { id: userId } },
    },
  });
}

/** 게시글 수정 */
async function update({ id, data }: { id: Article["id"]; data: ArticleInput }) {
  return await prisma.article.update({
    where: { id },
    data: data,
  });
}

/** 게시글 삭제 */
async function deleteById(id: Article["id"]) {
  return await prisma.article.delete({
    where: { id },
  });
}

/** 좋아요 토글
 * - 이미 눌렀으면 취소(삭제), 아니면 등록(생성)
 * - ArticleLike row 증감과 Article.likeCount 증감을 하나의 트랜잭션으로 처리 */
async function toggleLike({
  hasLikedArticle,
  ownerId,
  articleId,
}: {
  hasLikedArticle: Awaited<ReturnType<typeof findLikedArticleById>>;
  ownerId: User["id"];
  articleId: Article["id"];
}) {
  if (!hasLikedArticle) {
    const [articleLike] = await prisma.$transaction([
      prisma.articleLike.create({
        data: { ownerId, articleId },
      }),
      prisma.article.update({
        where: { id: articleId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return articleLike;
  }

  const [articleLike] = await prisma.$transaction([
    prisma.articleLike.delete({
      where: { ownerId_articleId: { ownerId, articleId } },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  return articleLike;
}

/** 게시글 소유자 id 조회 (권한 체크용) */
async function findOwnerId(id: User["id"]) {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: { ownerId: true },
  });

  return article.ownerId;
}

/** 특정 유저가 특정 게시글에 좋아요 눌렀는지 조회 */
async function findLikedArticleById({
  ownerId,
  articleId,
}: {
  ownerId: User["id"];
  articleId: Article["id"];
}) {
  return await prisma.articleLike.findUnique({
    where: {
      ownerId_articleId: { ownerId, articleId },
    },
  });
}

/** 특정 유저가 주어진 게시글 목록 중 좋아요 누른 게시글 id 목록 조회 */
async function findLikedArticleIds({
  ownerId,
  articleIds,
}: {
  ownerId: User["id"];
  articleIds: Article["id"][];
}) {
  const likes = await prisma.articleLike.findMany({
    where: { ownerId, articleId: { in: articleIds } },
    select: { articleId: true },
  });

  return likes.map((like) => like.articleId);
}

export default {
  findAll,
  findById,
  create,
  update,
  deleteById,
  toggleLike,
  findOwnerId,
  findLikedArticleById,
  findLikedArticleIds,
};
