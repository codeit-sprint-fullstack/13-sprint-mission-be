/**
 * [상품 관련 API 라우터]
 */
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
// [상품 등록 API - POST 요청 처리]
router.post("/items", async (req, res) => {
  try {
    const { name, title, price, description } = req.body;

    if (!name && !title) {
      return res.status(400).json({ message: "상품명은 필수입니다." });
    }

    const newProduct = new Product({
      title: title || name,
      price: Number(price),
      description: description,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "상품이 성공적으로 등록되었습니다.",
      id: savedProduct._id,
    });
  } catch (err) {
    console.error("상품 등록 중 에러:", err);
    res.status(500).json({ message: "서버 내부 오류로 등록에 실패했습니다." });
  }
});

// [상품 목록 조회 API - GET 요청 처리]

router.get("/items", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const totalCount = await Product.countDocuments();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ list: products, totalCount });
  } catch (err) {
    // 에러의 상세 내용을 출력
    console.error("❌ [GET /api/items] 오류 발생:", err);
    res.status(500).json({ message: "목록을 불러오는데 실패했습니다." });
  }
});

module.exports = router;
