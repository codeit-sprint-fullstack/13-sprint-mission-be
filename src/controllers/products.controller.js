import prisma from "../lib/prisma.js";
import {
  getProductSchema,
  postProductSchema,
  productIdSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";

export const getAllProducts = async (req, res) => {
  try {
    // const { page = "1", limit = "10", sort = "latest", keyword } = req.query;
    const validate = getProductSchema.parse(req.query);

    const where = {};

    if (validate.keyword) {
      where.OR = [
        { name: { contains: validate.keyword } },
        { description: { contains: validate.keyword } },
      ];
    }

    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      name: { name: "asc" },
    }[validate.sort] || { createdAt: "desc" };

    const pageNum = Number(validate.page) || 1;
    const take = Number(validate.limit) || 10;
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
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "올바른 데이터형식 아님",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = productIdSchema.parse(req.params);
    //여기서의 .parse는 zod 스키마 메서드로 입력값 받아서 유효성검사 후 변환된 값 반환하는 함수 JSON.parse와 다른 parse임
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "없는 id임" });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "올바른 데이터형식 아님",
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};

export const postProduct = async (req, res) => {
  try {
    // const { name, price, description, tags } = req.body;
    const validated = postProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: validated,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "입력 데이터가 이상함",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = productIdSchema.parse(req.params);
    const data = updateProductSchema.parse(req.body);
    const product = await prisma.product.update({
      // where: { id: Number(id) },
      where: { id },
      data,
    });
    res.json({ success: true, data: product });
  } catch (err) {
    //update는 해당 id를 못찾으면 prisma가 자동으로 error를 던지기 때문에 catch에서 잡는것이 자연스러움
    if (err.name === "ZodError") {
      return res.status(400).json({ success: false, message: err.errors });
    }

    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "해당 id의 게시물을 찾을 수 없음" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ success: true, message: "정상적으로 삭제되었습니다" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "없는 id" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
