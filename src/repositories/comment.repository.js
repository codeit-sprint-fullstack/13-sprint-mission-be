// ============================================================
// Comment Repository
// ============================================================
import prisma from "../config/prisma.js";

/** 댓글 목록 조회 (상품/게시글 공통) */
async function findAll({ type, id }) {
  if (type === "product") {
    return prisma.productComment.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.articleComment.findMany({
    where: { articleId: id },
    orderBy: { createdAt: "desc" },
  });
}

/** 댓글 생성 (상품/게시글 공통) */
async function create({ type, id, data, ownerId }) {
  if (type === "product") {
    return prisma.productComment.create({
      data: { content: data.content, productId: id, ownerId },
    });
  }

  return prisma.articleComment.create({
    data: { content: data.content, articleId: id, ownerId },
  });
}

/** 댓글 수정
 * - 내용만 변경 */
async function update({ id, data, type }) {
  if (type === "product") {
    return await prisma.productComment.update({
      where: { id },
      data: { content: data.content },
    });
  }

  return await prisma.articleComment.update({
    where: { id },
    data: { content: data.content },
  });
}

/** 댓글 삭제 */
async function deleteById(id, type) {
  if (type === "product") {
    return await prisma.productComment.delete({
      where: { id },
    });
  }

  return await prisma.articleComment.delete({
    where: { id },
  });
}

/** 댓글 소유자 id 조회 (권한 체크용)
 * - type이 라우트에서 이미 정해져 있으므로 해당 테이블만 조회 */
async function findOwnerId({ id, type }) {
  if (type === "product") {
    const comment = await prisma.productComment.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    return comment?.ownerId ?? null;
  }

  const comment = await prisma.articleComment.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  return comment?.ownerId ?? null;
}

export default {
  findAll,
  create,
  update,
  deleteById,
  findOwnerId,
};
