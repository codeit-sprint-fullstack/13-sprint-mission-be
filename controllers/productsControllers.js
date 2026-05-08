import Product from "../models/Product.js";

/// 전체 조회 컨트롤러
export const getProducts = async (req, res) => {
  try {
    const { offset = 0, limit, sort, keyword } = req.query;

    let products = await Product.find();

    if (keyword) {
      products = products.filter((product) => {
        return (
          product.name.includes(keyword) ||
          product.description.includes(keyword)
        );
      });
    }

    if (sort === "recent") {
      products.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    if (limit) {
      products = products.slice(Number(offset), Number(offset) + Number(limit));
    }

    const result = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      favoriteCount: product.favoriteCount,
      createdAt: product.createdAt,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

///id 조회 컨트롤러
export const getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: `상품을 찾을 수 없어요.` });
    }
    res.json({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: `유효하지 않은 ID 형식이에요.` });
  }
};

///상품등록 컨트롤러
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    // Mongoose 유효성 검사 실패 시
    res.status(400).json({ message: error.message });
  }
};

///상품 수정
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "구독을 찾을 수 없어요." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

///상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "구독을 찾을 수 없어요." });
    }

    // 삭제 성공 → 204 No Content
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
