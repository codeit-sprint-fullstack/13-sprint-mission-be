import HttpError from "../errors/HttpError.js";
import commentRepository, {
  CommentCreateData,
  CommentUpdateData,
  CommentWithUser,
} from "../repositories/commentRepository.js";

function withWriter({ user, ...rest }: CommentWithUser) {
  return {
    ...rest,
    writer: user
      ? { id: user.id, nickname: user.nickName, image: user.image }
      : null,
  };
}

async function getAllByProduct(productId: number, limit?: number) {
  const comments = await commentRepository.getAllByProduct(productId, limit);
  return { list: comments.map(withWriter) };
}

async function getAllByArticle(articleId: number, limit?: number) {
  const comments = await commentRepository.getAllByArticle(articleId, limit);
  return { list: comments.map(withWriter) };
}

async function getById(id: number) {
  const comment = await commentRepository.getById(id);
  if (!comment) {
    throw new HttpError("댓글을 찾을 수 없습니다.", 404);
  }
  return withWriter(comment);
}

async function create(comment: CommentCreateData) {
  return commentRepository.save(comment);
}

async function update(id: number, comment: CommentUpdateData) {
  return commentRepository.update(id, comment);
}

async function deleteById(id: number) {
  return commentRepository.deleteById(id);
}

export default {
  getAllByProduct,
  getAllByArticle,
  getById,
  create,
  update,
  deleteById,
};
