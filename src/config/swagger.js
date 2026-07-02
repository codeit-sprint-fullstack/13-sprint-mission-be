const { Component } = require("react");

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Panda Market API",
    version: "1.0.0",
    description: "중고마켓, 자유게시판, 인증, 업로드 API 명세",
  },
  servers: [{ url: "https://127.0.0.1:4000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      AuthBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "demo@panda.dev" },
          password: { type: "string", example: "password123" },
          nickname: { type: "string", example: "김코드" },
        },
      },
      ProductBody: {
        type: "object",
        required: ["name", "description", "price"],
        properties: {
          name: { type: "string", maxLength: 10 },
          description: { type: "string", minLength: 10 },
          price: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          imageUrls: { type: "array", items: { type: "string" } },
        },
      },
      ArticleBody: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          imageUrls: { type: "array", items: { type: "string" } },
        },
      },
      CommentBody: {
        type: "object",
        required: ["content"],
        properties: { content: { type: "string" } },
      },
    },
  },
  paths: {
    "/auth/signUp": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthBody" },
            },
          },
        },
        response: {
          201: { description: "회원가입 성공" },
          400: { description: "입력 오류" },
          409: { description: "이메일 중복" },
        },
      },
    },
    "/auth/signIn": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthBody" },
            },
          },
        },
        response: {
          200: { description: "로그인 성공" },
          401: { description: "인증 실패" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        response: {
          200: { description: "새 액세스 토큰 발급" },
          401: { description: "리프레시 토큰 오류" },
        },
      },
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        response: {
          200: { description: "내 정보" },
          401: { description: "로그인 필요" },
        },
      },
    },
    "/uploads/images": {
      post: {
        tags: ["Uploads"],
        security: [{ bearerAuth: [] }],
        requsetBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "업로드된 이미지 URL 목록" },
          400: { description: "업로드 오류" },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        parameters: [
          {
            name: "orderBy",
            in: "query",
            schema: { type: "string", enum: ["recent", "favorite"] },
          },
          { name: "keyword", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "상품 목록" } },
      },
      post: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductBody" },
            },
          },
        },
        responses: {
          201: { description: "상품 등록" },
          400: { description: "입력 오류" },
          401: { description: "로그인 필요" },
        },
      },
    },
    "/products/best": {
      get: {
        tags: ["Products"],
        responses: { 200: { description: "베스트 상품" } },
      },
    },
    "/products/{productId}": {
      get: {
        tags: ["Products"],
        responses: {
          200: { description: "상품 상세" },
          404: { description: "없음" },
        },
      },
      patch: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "상품 수정" },
          403: { description: "권한 없음" },
        },
      },
      delete: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "상품 삭제" },
          403: { description: "권한 없음" },
        },
      },
    },
    "/products/{productId}/favorite": {
      post: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "좋아요" } },
      },
      delete: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "좋아요 취소" } },
      },
    },
    "/products/{productId}/comments": {
      get: {
        tags: ["Comments"],
        responses: { 200: { description: "상품 댓글 목록" } },
      },
      post: {
        tags: ["Comments"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "상품 댓글 등록" } },
      },
    },
    "/articles": {
      get: {
        tags: ["Articles"],
        responses: { 200: { description: "게시글 목록" } },
      },
      post: {
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "게시글 등록" } },
      },
    },
    "/articles/best": {
      get: {
        tags: ["Articles"],
        responses: { 200: { description: "베스트 게시글" } },
      },
    },
    "/articles/{articleId}": {
      get: {
        tags: ["Articles"],
        responses: {
          200: { description: "게시글 상세" },
          404: { description: "없음" },
        },
      },
      patch: {
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "게시글 수정" } },
      },
      delete: {
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "게시글 삭제" } },
      },
    },
    "/articles/{articleId}/favorite": {
      post: {
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "좋아요" } },
      },
      delete: {
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "좋아요 취소" } },
      },
    },
    "/articles/{articleId}/comments": {
      get: {
        tags: ["Comments"],
        responses: { 200: { description: "게시글 댓글 목록" } },
      },
      post: {
        tags: ["Comments"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "게시글 댓글 등록" } },
      },
    },
    "/comments/{commentId}": {
      patch: {
        tags: ["Comments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "댓글 수정" } },
      },
      delete: {
        tags: ["Comments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "댓글 삭제" } },
      },
    },
  },
};
