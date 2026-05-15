import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '인증이 필요합니다.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function serializeProductListItem(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    createdAt: product.createdAt,
  };
}

app.get(['/products', '/items'], async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit || req.query.pageSize) || 10, 1), 50);
    const offset =
      req.query.offset !== undefined
        ? Math.max(Number(req.query.offset), 0)
        : (page - 1) * limit;
    const keyword = String(req.query.keyword || req.query.search || '').trim();

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: { id: true, name: true, price: true, createdAt: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      list: items.map(serializeProductListItem),
      totalCount: total,
      offset,
      limit,
      hasNext: offset + items.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post(['/products', '/items'], authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        userId: req.user.userId,
      },
    });

    res.status(201).json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get(['/products/:id', '/items/:id'], async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true, updatedAt: true },
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: '잘못된 상품 id입니다.' });
  }
});

app.patch(['/products/:id', '/items/:id'], authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    if (product.userId !== req.user.userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const data = {};
    ['name', 'description', 'tags'].forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });
    if (req.body.price !== undefined) data.price = Number(req.body.price);

    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
    });

    res.json(serializeProduct(updated));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(400).json({ message: error.message });
  }
});

app.delete(['/products/:id', '/items/:id'], authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    if (product.userId !== req.user.userId) return res.status(403).json({ message: '권한이 없습니다.' });

    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// ===== 인증 =====

app.post('/auth/signUp', async (req, res) => {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;
    if (!email || !nickname || !password) return res.status(400).json({ message: '필수 항목을 입력해 주세요.' });
    if (password !== passwordConfirmation) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ accessToken, user: { id: user.id, email: user.email, nickname: user.nickname } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/auth/signIn', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ accessToken, user: { id: user.id, email: user.email, nickname: user.nickname } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===== 자유게시판 =====

// 게시글 목록 조회
app.get('/articles', async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;
    const keyword = String(req.query.keyword || '').trim();
    if (keyword.length > 50) return res.status(400).json({ message: '검색어는 50자 이내로 입력해 주세요.' });

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: { id: true, title: true, content: true, createdAt: true },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ list: articles, totalCount: total, offset, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 게시글 등록
app.post('/articles', async (req, res) => {
  try {
    const article = await prisma.article.create({
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 게시글 상세 조회
app.get('/articles/:id', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: '잘못된 게시글 id입니다.' });
  }
});

// 게시글 수정
app.patch('/articles/:id', async (req, res) => {
  try {
    const data = {};
    ['title', 'content'].forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(article);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(400).json({ message: error.message });
  }
});

// 게시글 삭제
app.delete('/articles/:id', async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
});

// ===== 상품 댓글 =====

app.post(['/products/:productId/comments', '/items/:productId/comments'], authenticateToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

    const comment = await prisma.productComment.create({
      data: { content: req.body.content, productId, userId: req.user.userId },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get(['/products/:productId/comments', '/items/:productId/comments'], async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const cursor = req.query.cursor ? { cursor: { id: Number(req.query.cursor) }, skip: 1 } : {};

    const comments = await prisma.productComment.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
      take: limit + 1,
      select: { id: true, content: true, createdAt: true },
      ...cursor,
    });

    const hasNext = comments.length > limit;
    if (hasNext) comments.pop();

    res.json({ list: comments, nextCursor: hasNext ? comments[comments.length - 1].id : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch(['/products/:productId/comments/:commentId', '/items/:productId/comments/:commentId'], authenticateToken, async (req, res) => {
  try {
    const comment = await prisma.productComment.findUnique({
      where: { id: Number(req.params.commentId) },
      select: { userId: true },
    });

    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment.userId !== req.user.userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const updated = await prisma.productComment.update({
      where: { id: Number(req.params.commentId), productId: Number(req.params.productId) },
      data: { content: req.body.content },
    });
    res.json(updated);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(400).json({ message: error.message });
  }
});

app.delete(['/products/:productId/comments/:commentId', '/items/:productId/comments/:commentId'], authenticateToken, async (req, res) => {
  try {
    const comment = await prisma.productComment.findUnique({
      where: { id: Number(req.params.commentId) },
      select: { userId: true },
    });

    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment.userId !== req.user.userId) return res.status(403).json({ message: '권한이 없습니다.' });

    await prisma.productComment.delete({
      where: { id: Number(req.params.commentId), productId: Number(req.params.productId) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
});

// ===== 게시글 댓글 =====

app.post('/articles/:articleId/comments', async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const comment = await prisma.articleComment.create({
      data: { content: req.body.content, articleId },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/articles/:articleId/comments', async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const cursor = req.query.cursor ? { cursor: { id: Number(req.query.cursor) }, skip: 1 } : {};

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'asc' },
      take: limit + 1,
      select: { id: true, content: true, createdAt: true },
      ...cursor,
    });

    const hasNext = comments.length > limit;
    if (hasNext) comments.pop();

    res.json({ list: comments, nextCursor: hasNext ? comments[comments.length - 1].id : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/articles/:articleId/comments/:commentId', async (req, res) => {
  try {
    const comment = await prisma.articleComment.update({
      where: { id: Number(req.params.commentId), articleId: Number(req.params.articleId) },
      data: { content: req.body.content },
    });
    res.json(comment);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(400).json({ message: error.message });
  }
});

app.delete('/articles/:articleId/comments/:commentId', async (req, res) => {
  try {
    await prisma.articleComment.delete({ where: { id: Number(req.params.commentId), articleId: Number(req.params.articleId) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Panda Market API is running.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요!`);
});
