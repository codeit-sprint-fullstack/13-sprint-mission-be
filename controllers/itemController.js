import Product from "../models/Product.js";

/** ======== 상품 컨트롤러 ======== */

// GET /items
export const getProducts = async (req, res) => {
  try {
    // 음수, 0, NaN 방어
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || 10, 1),
      100,
    );
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
      .select("-__v")
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
    const product = await Product.findById(id).select("-__v");

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
    const { name, price, description, tags } = req.body;

    // 필수 필드 검증
    if (!name || !price || !description || !tags) {
      throw new Error("모든 필드는 필수입니다", 400);
    }

    // tags 배열 검증
    if (!Array.isArray(tags)) {
      throw new Error("tags는 배열이어야 합니다", 400);
    }

    // 가격 유효성 검증
    if (typeof price !== "number" || price <= 0) {
      throw new Error("price는 0보다 큰 숫자여야 합니다", 400);
    }

    // tags 배열의 각 요소 검증
    const validatedTags = tags.filter((tag) => {
      if (typeof tag !== "string") return false;

      const trimmed = tag.trim();
      // 1~5글자 범위 검사
      return trimmed.length > 0 && trimmed.length <= 5;
    });

    // 유효하지 않은 tag가 있으면 에러
    if (validatedTags.length !== tags.length) {
      throw new Error("모든 tag는 1~5글자의 문자열이어야 합니다", 400);
    }

    // 추출된 필드만 사용 (화이트리스트)
    const product = await Product.create({
      name: name.trim(),
      price,
      description: description.trim(),
      tags: validatedTags.map((tag) => tag.trim()),
    });

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
