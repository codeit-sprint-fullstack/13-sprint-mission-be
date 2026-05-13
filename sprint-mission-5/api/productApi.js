import express from "express";
import Product from "../schema/product.js";

const router = express.Router();

//생성
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//목록 조회
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword || "";

    const query = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {}; // keyword 없으면 전체 조회

    const [products, total] = await Promise.all([
      Product.find(query)
        .select("id name price createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//단일 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//수정
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: true, runValidators: true }, // new: 수정된 데이터 반환, runValidators: 스키마 검증 실행
    );

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }

    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//삭제
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
    }

    res.status(200).json({ message: "삭제 완료" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
