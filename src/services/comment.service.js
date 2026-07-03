import { HttpError } from "../middlewares/error.js";
import * as articlesRepository from "../repositories/article.repository.js";
import * as commentsRepository from "../repositories/comment.repository.js";
import * as productsRepository from "../repositories/product.repository.js";
import { createId } from "../repositories/prisma.repository.js";
import { commentResponse } from "../utils/presenter.util.js";
import { paginate } from "../utils/list.util.js";

async function assertTarget(targetType, targetId) {
  const exists =
    targetType === "product"
      ? await productsRepository.findById(targetId)
      : await articlesRepository.findById(targetId);

  if (!exists) {
    throw new HttpError(
      404,
      targetType === "product"
        ? "상품을 찾을 수 없습니다."
        : "게시글을 찾을 수 없습니다.",
    );
  }
  return exists;
}

async function listByTarget(targetType, targetId, query) {
  await assertTarget(targetType, targetId);
  const comments = await commentsRepository.findByTarget(targetType, targetId);
  return paginate(comments.map(commentResponse), query);
}

async function createForTarget(targetType, targetId, content, user) {
  await assertTarget(targetType, targetId);
  const comment = await commentsRepository.create({
    id: createId("comment"),
    targetType,
    targetId,
    content,
    ownerId: user.is,
  });
  return commentResponse(comment);
}

async function update(commentId, content, user) {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) throw new HttpError(404, "댓글을 찾을 수 없습니다.");
  if (comment.ownerId !== user.id)
    throw new HttpError(403, "댓글 작성자만 수정할 수 있습니다.");
  const updated = await commentsRepository.update(commentId, { content });
  return commentResponse(updated);
}

async function remove(commentId, user) {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) throw new HttpError(404, "댓글을 찾을 수 없습니다.");
  if (comment.ownerId !== user.id)
    throw new HttpError(403, "댓글 작성자만 삭제할 수 있습니다.");
  await commentsRepository.remove(comment.id);
  return { ok: true };
}

export { createForTarget, listByTarget, remove, update };
