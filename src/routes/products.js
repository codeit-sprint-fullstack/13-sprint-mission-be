// 상품 API 모음

const express = require("express");
const router = express.Router(); // 요청을 받을 app 대리인
const Product = require("../models/Product");

// 상품 등록
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 상품 목록 조회
router.get("/", async (req, res) => {
  try {
    const {
      page = Number(1),
      pageSize = Number(10),
      orderBy = "recent",
      keyword = "",
    } = req.query;
    // 검색
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword } },
          ],
        }
      : {}; //MongoDB에서 "조건 없음 = 전부 다"
    // 정렬
    const sortOrder =
      orderBy === "recent" ? { createdAt: -1 } : { favoriteCount: -1 };
    // 페이지네이션
    const totalCount = await Product.countDocuments(filter);

    const product = await Product.find(filter)
      .sort(sortOrder)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    res.status(200).json({ totalCount, list: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 상품 수정
router.patch("/:id", async (req, res) => {
  try {
    // 상품 내용 찾기/수정
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }

    // 수정된 상품으로 응답
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    // 상품 내용 찾기/삭제
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 상품 상세 페이지 조회
router.get("/:id", async (req, res) => {
  // 상품 찾기
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없음" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
