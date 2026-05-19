const prisma = require("../lib/prisma");

exports.createComment = async (data) => {
  return await prisma.articleComment.create({ data });
};

exports.findComments = async (query) => {
  // Cursor 페이지네이션에 필요한 query 객체를 Service 단에서 조립해 전달
  return await prisma.articleComment.findMany(query);
};

exports.updateComment = async (id, data) => {
  return await prisma.articleComment.update({
    where: { id },
    data,
  });
};

exports.deleteComment = async (id) => {
  return await prisma.articleComment.delete({ where: { id } });
};
