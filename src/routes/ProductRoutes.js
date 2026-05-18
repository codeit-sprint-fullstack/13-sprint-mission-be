import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("받은 body:", req.body);

    const { name, description, price, tags = [] } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("상품 등록 백엔드 에러:", error);

    res.status(400).json({
      message: "상품 등록 실패",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try{
   const {
    offset = 0,
    limit = 10,
    orderBy = "recent",
    keyword = "",
   } = req.query;

   const where = keyword
    ? {
      OR: [
        {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
     }
    : {};
    const orderByOption =
    orderBy === "recent"
    ? {
      createdAt: "desc",
    }
    : undefined;
    
    const products = await prisma.product.findMany({
      where,
      orderBy: orderByOption,
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

  res.status(200).json(products);
  } catch (error) {
  console.error("상품 목록 조회 실패:", error);

  res.status(500).json({
    message: "상품 목록 조회 실패",
    error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: "상품 상세 조회 실패",
      error: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const {name, description, price, tags } = req.body;

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(tags !== undefined && { tags }),
      },
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: "상품 수정 실패",
      error: error.message,
    });
  }
});

  router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "상품 삭제 실패",
      error: error.message,
    });
  }
  });

export default router;