import prisma from "../lib/prisma.js";
/// 상품 등록 컨드롤러
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, tags } = req.body;

    const product = await prisma.product.create({
      data: { name, price: Number(price), description, tags },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

///전체 조회 컨트롤러
export const getAllProduct = async (req, res) => {
  try {
    const { keyword, sort = "latest", page = "1", limit = "10" } = req.query;
    const where = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }
    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      name: { name: "asc" },
    }[sort] || { createdAt: "desc" };

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take }),
      prisma.product.count({ where }),
    ]);
    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

///상품 상세 조회
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "상품을 찾을 수 없습니다" });
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
        createdAt: product.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

///상품 수정 컨트롤러
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, tags, price } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: Number(price),
        description,
        tags,
      },
    });
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "상품을 찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

///상품 삭제 컨트롤러
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "상품이 삭제되었습니다" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "상품을 찾을 수 없습니다" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
