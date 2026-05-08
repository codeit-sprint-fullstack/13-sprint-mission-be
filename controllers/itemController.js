import Product from "../models/Product.js";

/** ======== 상품 컨트롤러 ======== */

// GET /items
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const keyword = req.query.keyword || "";
    const orderBy = req.query.order || "recent";

    const sortOption = {
      recent: { createdAt: -1 },
      // favorite: { favoriteCount: -1 },
    };

    let query = {};

    const selectedSort = sortOption[orderBy] || { createdAt: -1 };

    if (keyword) {
      const searchRegex = { $regex: keyword, $options: "i" };
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const totalCount = await Product.countDocuments(query);

    const list = await Product.find(query)
      .sort(selectedSort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ totalCount, list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /items:id
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res
        .status(404)
        .json({ message: `id가 ${id} 인 상품을 찾을 수 없습니다.` });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /items
export const postProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /items/:id
export const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /items/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ message: "상품을 찾을 수 없어요." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
