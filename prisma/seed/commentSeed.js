const productComments = [
  "가격 조금 더 조정 가능할까요?",
  "직거래 가능한 지역이 어디인가요?",
];

const articleComments = ["공감합니다!", "좋은 정보 감사해요."];

export async function seedComments(prisma, users, products, articles) {
  const comments = [];

  for (const product of products) {
    for (let i = 0; i < productComments.length; i++) {
      const commenter = users[(product.id + i) % users.length];
      const comment = await prisma.comment.create({
        data: {
          content: productComments[i],
          ownerId: commenter.id,
          productId: product.id,
        },
      });
      comments.push(comment);
    }
  }

  for (const article of articles) {
    for (let i = 0; i < articleComments.length; i++) {
      const commenter = users[(article.id + i) % users.length];
      const comment = await prisma.comment.create({
        data: {
          content: articleComments[i],
          ownerId: commenter.id,
          articleId: article.id,
        },
      });
      comments.push(comment);
    }
  }

  return comments;
}
