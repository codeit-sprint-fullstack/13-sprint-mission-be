const commentRepository = require("../repositories/commentRepository");
const { validateComment } = require("../schemas/commentSchema");

exports.createComment = async (articleId, content) => {
  const validationError = validateComment(content, false);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  return await commentRepository.createComment({ content, articleId });
};

exports.getComments = async (articleId, queryOptions) => {
  const limit = parseInt(queryOptions.limit) || 10;
  const cursor = queryOptions.cursor
    ? parseInt(queryOptions.cursor)
    : undefined;

  const comments = await commentRepository.findComments({
    where: { articleId },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, createdAt: true },
  });

  let nextCursor = null;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem.id;
  }
  return { list: comments, nextCursor };
};

exports.updateComment = async (commentId, content) => {
  const validationError = validateComment(content, true);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  return await commentRepository.updateComment(commentId, { content });
};
