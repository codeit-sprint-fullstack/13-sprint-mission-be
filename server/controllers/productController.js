import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      tags,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { offset = 0, limit = 10, keyword = "" } = req.query;

    const products = await Product.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })

      .sort({ createAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "상품이 없습니다.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateProduct) {
      return res.status(404).json({
        message: "상품이 존재하지 않습니다.",
      });
    }

    res.status(200).json(updateProduct);
  } catch (error) {
    req.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndUpdate(id);

    if (!deleteProduct) {
      return res.status(404).json({
        message: "상품이 존재하지 않습니다.",
      });
    }

    res.status(200).json({
      message: "삭제 완료",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
