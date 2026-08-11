// ============================================================
// Swagger (OpenAPI) 설정
// ============================================================
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "중고마켓 & 자유게시판 API",
      version: "1.0.0",
      description:
        "중고마켓(Product) 및 자유게시판(Article) 서비스 API 명세서",
    },
    servers: [{ url: "http://localhost:3000", description: "로컬 서버" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "로그인(POST /auth/signin) 응답으로 받은 accessToken을 'Bearer {token}' 형식으로 전달",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nickname: { type: "string", example: "홍길동" },
            email: { type: "string", format: "email", example: "user@example.com" },
            avatar: { type: "string", nullable: true, example: null },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Owner: {
          type: "object",
          description: "상품/게시글/댓글 작성자의 공개 정보만 포함",
          properties: {
            id: { type: "integer", example: 1 },
            nickname: { type: "string", example: "홍길동" },
            avatar: { type: "string", nullable: true, example: null },
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer" },
            tag: { type: "string", example: "전자" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "맥북" },
            description: { type: "string", example: "올해 최신 상품 맥북입니다." },
            price: { type: "integer", example: 2500000 },
            images: {
              type: "array",
              items: { type: "string", format: "uri" },
            },
            likeCount: { type: "integer", example: 3 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["맥북", "노트북"],
            },
            ownerId: { type: "integer" },
            owner: { $ref: "#/components/schemas/Owner" },
            isLiked: {
              type: "boolean",
              description: "요청한 유저가 이 상품에 좋아요를 눌렀는지 여부 (로그인 시에만 정확히 계산됨)",
            },
            productComments: {
              type: "array",
              items: { $ref: "#/components/schemas/Comment" },
              description: "단건 조회 시에만 포함",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "안녕하세요" },
            content: { type: "string", example: "자유게시판 첫 글입니다." },
            images: {
              type: "array",
              items: { type: "string", format: "uri" },
            },
            likeCount: { type: "integer", example: 3 },
            ownerId: { type: "integer" },
            owner: { $ref: "#/components/schemas/Owner" },
            isLiked: {
              type: "boolean",
              description: "요청한 유저가 이 게시글에 좋아요를 눌렀는지 여부 (로그인 시에만 정확히 계산됨)",
            },
            articleComments: {
              type: "array",
              items: { $ref: "#/components/schemas/Comment" },
              description: "단건 조회 시에만 포함",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            content: { type: "string", example: "좋은 상품이네요!" },
            ownerId: { type: "integer" },
            productId: { type: "integer", nullable: true },
            articleId: { type: "integer", nullable: true },
            isMyComment: {
              type: "boolean",
              description: "요청한 유저가 작성한 댓글인지 여부 (로그인 시에만 정확히 계산됨)",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            totalPages: { type: "integer" },
            currentPage: { type: "integer" },
            hasNextPage: { type: "boolean" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "에러 메시지" },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "요청 값 검증 실패",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "인증 실패 (로그인 필요, 토큰 없음/만료)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "권한 없음 (본인 소유가 아닌 리소스)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "리소스를 찾을 수 없음",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Conflict: {
          description: "중복된 리소스 (이미 존재하는 이메일 등)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/docs/*.swagger.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
