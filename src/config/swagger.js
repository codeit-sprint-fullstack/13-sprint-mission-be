import swaggerJsdoc from "swagger-jsdoc";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3002;

const servers = IS_PRODUCTION
  ? [{ url: process.env.SERVER_URL, description: "Production" }]
  : [{ url: `http://localhost:${PORT}`, description: "Local" }];

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "13-sprint-mission-be API",
      version: "1.0.0",
      description: "중고마켓 / 자유게시판 API 명세서",
    },
    servers,
    tags: [
      { name: "Auth", description: "회원가입/로그인/토큰" },
      { name: "Users", description: "사용자" },
      { name: "Products", description: "상품" },
      { name: "ProductComments", description: "상품 댓글" },
      { name: "Articles", description: "게시글" },
      { name: "ArticleComments", description: "게시글 댓글" },
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
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            nickname: { type: "string" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "integer" },
            description: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
            favoriteCount: { type: "integer" },
            isLiked: { type: "boolean" },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductList: {
          type: "object",
          properties: {
            totalCount: { type: "integer" },
            list: { type: "array", items: { $ref: "#/components/schemas/Product" } },
          },
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            favoriteCount: { type: "integer" },
            isLiked: { type: "boolean" },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ArticleList: {
          type: "object",
          properties: {
            totalCount: { type: "integer" },
            list: { type: "array", items: { $ref: "#/components/schemas/Article" } },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CommentList: {
          type: "object",
          properties: {
            nextCursor: { type: "string", nullable: true },
            list: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
});

export default swaggerSpec;
