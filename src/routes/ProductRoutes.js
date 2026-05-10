import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("받은 body:", req.body);

    const { name, description, price, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      tags,
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

   const filter = keyword
    ? {
      $or: [
        { name: { $regex: keyword, $options: "i"} },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }
    : {};
    const sort = orderBy === "recent" ? { createdAt: -1 } : {};
    
    const products = await Product.find(filter)
    .sort(sort)
    .skip(Number(offset))
    .limit(Number(limit))
    .select("name price createdAt")

  res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "상품 목록 조회 실패",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: "상품 상세 조회 실패",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: "상품 수정 실패",
    });
  }
});

  router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "상품 삭제 실패",
    });
  }
});

export default router;