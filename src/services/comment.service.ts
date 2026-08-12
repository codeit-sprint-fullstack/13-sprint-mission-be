// ============================================================
// Comment Service
// ============================================================
import { User } from "@prisma/client";
import { AppError } from "../middlewares/errors.js";
import commentRepository from "../repositories/comment.repository.js";
import { CommentTarget } from "../types/comment.js";

/** 댓글 목록 조회 서비스 로직 (상품/게시글 공통)
 * - userId가 있으면 isMyComment 계산 */
async function getAll({
  type,
  id,
  userId,
}: Omit<CommentTarget, "data"> & { userId: User["id"] }) {
  const comments = await commentRepository.findAll({ type, id });

  return {
    data: comments.map((comment) => ({
      ...comment,
      isMyComment: userId ? comment.ownerId === userId : false,
    })),
  };
}

/** 댓글 생성 서비스 로직 (상품/게시글 공통) */
async function create({
  type,
  id,
  data,
  ownerId,
}: CommentTarget & { ownerId: User["id"] }) {
  return await commentRepository.create({ type, id, data, ownerId });
}

/** 댓글 수정 서비스 로직 (상품/게시글 공통)
 * - 작성자만 수정 가능 */
async function update({
  id,
  data,
  type,
  userId,
}: CommentTarget & { userId: User["id"] }) {
  const ownerId = await commentRepository.findOwnerId({ id, type });

  if (ownerId === null) {
    throw new AppError("댓글을 찾을 수 없습니다.", 404);
  }

  if (ownerId !== userId) {
    throw new AppError("본인이 작성한 댓글만 수정할 수 있습니다.", 403);
  }

  return await commentRepository.update({ id, data, type });
}

/** 댓글 삭제 서비스 로직 (상품/게시글 공통)
 * - 작성자만 삭제 가능 */
async function deleteById({
  id,
  type,
  userId,
}: Omit<CommentTarget, "data"> & { userId: User["id"] }) {
  const ownerId = await commentRepository.findOwnerId({ id, type });

  if (ownerId === null) {
    throw new AppError("댓글을 찾을 수 없습니다.", 404);
  }

  if (ownerId !== userId) {
    throw new AppError("본인이 작성한 댓글만 삭제할 수 있습니다.", 403);
  }

  return await commentRepository.deleteById({ id, type });
}

export default {
  getAll,
  create,
  update,
  deleteById,
};
