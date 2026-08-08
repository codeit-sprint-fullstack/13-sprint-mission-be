import { HttpError } from "../middlewares/error";
import * as articlesRepository from "../repositories/article.repository";
import * as commentsRepository from "../repositories/comment.repository";
import * as productsRepository from "../repositories/product.repository";
import { createId } from "../repositories/prisma.repository";
import { commentResponse } from "../utils/presenter.util";
import { paginate } from "../utils/list.util";
import type {
  AuthUser,
  ListQuery,
  TargetRef,
  TargetType,
} from "../types/domain";

function toTargetRef(targetType: TargetType, targetId: string): TargetRef {
  return targetType === "product"
    ? { targetType: "product", targetId }
    : { targetType: "article", targetId };
}

async function assertTarget(target: TargetRef) {
  const exists =
    target.targetType === "product"
      ? await productsRepository.findById(target.targetId)
      : await articlesRepository.findById(target.targetId);

  if (!exists) {
    throw new HttpError(
      404,
      target.tragetType === "product"
        ? "상품을 찾을 수 없습니다."
        : "게시글을 찾을 수 없습니다.",
    );
  }
  return exists;
}

async function listByTarget(
  targetType: TargetType,
  targetId: string,
  query: ListQuery,
) {
  const target = toTargetRef(targetType, targetId);
  await assertTarget(target);
  const comments = await commentsRepository.findByTarget(targetType, targetId);
  return paginate(comments.map(commentResponse), query);
}

async function createForTarget(
  targetType: TargetType,
  targetId: string,
  content: string,
  user: AuthUser,
) {
  const target = toTargetRef(targetType, targetId);
  await assertTarget(target);
  const comment = await commentsRepository.create({
    id: createId("comment"),
    targetType: target.targetType,
    targetId: target.targetId,
    content,
    ownerId: user.id,
  });
  return commentResponse(comment);
}

async function update(commentId: string, content: string, user: AuthUser) {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) throw new HttpError(404, "댓글을 찾을 수 없습니다.");
  if (comment.ownerId !== user.id)
    throw new HttpError(403, "댓글 작성자만 수정할 수 있습니다.");
  const updated = await commentsRepository.update(commentId, { content });
  return commentResponse(updated);
}

async function remove(commentId: string, user: AuthUser) {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) throw new HttpError(404, "댓글을 찾을 수 없습니다.");
  if (comment.ownerId !== user.id)
    throw new HttpError(403, "댓글 작성자만 삭제할 수 있습니다.");
  await commentsRepository.remove(comment.id);
  return { ok: true };
}

export { createForTarget, listByTarget, remove, update };
