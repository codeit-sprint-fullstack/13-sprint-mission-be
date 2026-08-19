import swaggerJSDoc from "swagger-jsdoc";
import env from "./env.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Panda Market API",
    version: "1.0.0",
    description: "판다마켓 백엔드 API 문서",
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nickName: { type: "string", example: "판다" },
          email: { type: "string", example: "panda@example.com" },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "아이폰 14" },
          description: { type: "string", example: "거의 새 제품입니다." },
          price: { type: "integer", example: 900000 },
          tags: { type: "array", items: { type: "string" } },
          images: { type: "array", items: { type: "string" } },
          ownerId: { type: "integer", example: 1 },
          favoriteCount: { type: "integer", example: 0 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "description", "price"],
        properties: {
          name: { type: "string", example: "아이폰 14" },
          description: { type: "string", example: "거의 새 제품입니다." },
          price: { type: "integer", example: 900000 },
          tags: { type: "array", items: { type: "string" } },
          images: { type: "array", items: { type: "string" } },
        },
      },
      Article: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "자유게시판 글 제목" },
          content: { type: "string", example: "본문 내용" },
          image: { type: "string", nullable: true },
          likeCount: { type: "integer", example: 0 },
          ownerId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ArticleInput: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "자유게시판 글 제목" },
          content: { type: "string", example: "본문 내용" },
          image: { type: "string", nullable: true },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          content: { type: "string", example: "좋은 글이네요!" },
          productId: { type: "integer", nullable: true },
          articleId: { type: "integer", nullable: true },
          ownerId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CommentInput: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", example: "좋은 글이네요!" },
          productId: { type: "integer", nullable: true },
          articleId: { type: "integer", nullable: true },
        },
      },
      Like: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
          productId: { type: "integer", nullable: true, example: 1 },
          articleId: { type: "integer", nullable: true, example: null },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
