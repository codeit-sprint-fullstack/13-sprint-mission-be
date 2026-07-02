const result = await prisma.comment.create({
    data: {
      articleId: Number(articleId),
      ...req.body,
    },
  });