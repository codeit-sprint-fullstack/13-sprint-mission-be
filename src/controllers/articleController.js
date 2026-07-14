import articleService from "../services/articleService.js";

async function getAll(req, res, next) {
  try {
    const { page, pageSize, limit, orderBy, keyword } = req.query;
    const result = await articleService.getAll(req.auth?.userId, {
      page,
      pageSize,
      limit,
      orderBy,
      keyword,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const article = await articleService.getById(id, req.auth?.userId);
    return res.json(article);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  const { userId } = req.auth;
  try {
    const createArticle = await articleService.create({
      ...req.body,
      ownerId: userId,
    });
    return res.status(201).json(createArticle);
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const updateArticle = await articleService.update({
      id: req.params.id,
      ...req.body,
    });
    return res.json(updateArticle);
  } catch (error) {
    return next(error);
  }
}

async function deleteById(req, res, next) {
  try {
    await articleService.deleteById(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error("이미지 파일이 필요합니다.");
      error.code = 400;
      throw error;
    }
    return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    return next(error);
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
  uploadImage,
};
