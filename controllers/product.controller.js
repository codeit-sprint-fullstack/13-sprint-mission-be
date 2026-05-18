import prisma from "../lib/prisma.js";

export const GetProduct = async (req, res) => {
  try {
    const { page, pageSize, orderBy, keyword } = req.query;
    const take = Number(pageSize);
    const skip = (Number(page) - 1) * take;
    let where = {};
    if (keyword) {
      where.OR = [
        {
          name: { contains: search },
        },
        {
          description: { contains: search },
        },
      ];
    }

    const totalCnt = await prisma.product.count({ where });
    const productData = await prisma.product.findMany({ where, skip, take });

    if (productData.length === 0)
      return res.status(404).json({ message: "데이터가 없습니다." });
    res.status(200).json({ totalCnt: totalCnt, list: productData });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const GetProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await prisma.product.findMany({
      where: { id: Number(id) },
    });

    if (productData.length === 0)
      return res.status(404).json({ message: "데이터가 없습니다." });
    res.status(200).json(productData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PostProduct = async (req, res) => {
  try {
    const { tags, ...productData } = req.body;
    const tagArr = tags || [];

    const newTag = tagArr.map((tag) => {
      return {
        where: { name: tag },
        create: { name: tag },
      };
    });

    const newData = await prisma.product.create({
      data: {
        ...productData,
        tags: { connectOrCreate: newTag },
      },
      include: {
        tags: true,
      },
    });

    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PatchProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productData = await prisma.product.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(200).json(productData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = await prisma.product.delete({
      where: { id: Number(id) },
    });
    if (!productData) {
      throw new Error("해당하는 ID가 없습니다.");
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
};
