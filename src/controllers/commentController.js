import commentService from "../services/commentService.js";

async function getAll(req, res, next) {
  try {
    const getAllComment = await commentService.getAll({
      ...req.body,
    });
    return res.status(200).json(getAllComment);
  } catch (error) {
    next(error);
  }
}

async function getAllByProduct(req, res, next) {
  try {
    const result = await commentService.getAllByProduct(
      req.params.id,
      req.query.limit,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getAllByArticle(req, res, next) {
  try {
    const result = await commentService.getAllByArticle(
      req.params.id,
      req.query.limit,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  const { id } = req.params;
  try {
    const comment = await commentService.getById(id);
    return res.json(comment);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  const { userId } = req.auth;
  try {
    const createComment = await commentService.create({
      ...req.body,
      ownerId: userId,
    });
    return res.status(201).json(createComment);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const updateComment = await commentService.update(
      req.params.id,
      req.body,
    );
    return res.json(updateComment);
  } catch (error) {
    next(error);
  }
}

async function deleteById(req, res, next) {
  try {
    await commentService.deleteById(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default {
  getAll,
  getAllByProduct,
  getAllByArticle,
  getById,
  create,
  update,
  deleteById,
};
