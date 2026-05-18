import prisma from "../lib/prisma.js";

export const GetArticle = async (req, res) => {
  try {
    const { page, pageSize, sort, keyword } = req.query;
    const take = Number(pageSize);
    const skip = (Number(page) - 1) * take;
    const orderBy = { recent: { createdAt: "desc" } }[sort] || {
      createdAt: "desc",
    };
    let where = {};
    if (keyword) {
      where.OR = [
        {
          title: { contains: keyword },
        },
        {
          content: { contains: keyword },
        },
      ];
    }

    const totalCnt = await prisma.article.count({ where });
    const articleData = await prisma.article.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    if (articleData.length === 0)
      return res.status(404).json({ message: "데이터가 없습니다." });
    res.status(200).json({ totalCnt: totalCnt, list: articleData });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const GetArticleDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = await prisma.article.findMany({
      where: { id: Number(id) },
    });

    if (articleData.length === 0)
      return res.status(404).json({ message: "데이터가 없습니다." });
    res.status(200).json(articleData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PostArticle = async (req, res) => {
  try {
    const articleData = await prisma.article.create({ data: req.body });

    res.status(201).json(articleData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PatchArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const articleData = await prisma.article.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(200).json(articleData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const DeleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = await prisma.article.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
};
