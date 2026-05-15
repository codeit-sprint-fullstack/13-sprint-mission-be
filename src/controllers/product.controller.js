import prisma from "../lib/prisma.js";

// 상품 등록
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, favoriteCount } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, favoriteCount },
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 상품 목록 조회
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
    // 쿼리 수정: FE에도 반영되어야 함
    // orderBy -> sort
    // keyword -> search
    // pageSize -> limit

    // 검색
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // 정렬
    const orderBy = {
      recent: { createdAt: "desc" },
      favorite: { favoriteCount: "desc" },
    }[sort] || { createdAt: "desc" };

    // 페이지네이션
    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;

    // 데이터, 총 갯수
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        sort: orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      totalCount,
      data: products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 상품 상세 페이지 조회
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "찾을 수 없습니다" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 상품 수정
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ success: true, data: product });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// 상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "삭제되었습니다" });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "찾을 수 없습니다" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
