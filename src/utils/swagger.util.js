export default {
  openapi: "3.0.0",
  info: {
    title: "Panda Market API",
    version: "1.0.0",
    description: "중고마켓, 자유게시판, 인증, 이미지 업로드 API 명세",
  },
  servers: [{ url: "http://127.0.0.1:4000" }],
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
          name: { type: "string", maxLength: 10, example: "반팔티" },
          description: {
            type: "string",
            minLength: 10,
            example: "상태 좋은 반팔 티셔츠입니다.",
          },
          price: { type: "number", example: 12000 },
          tags: {
            type: "array",
            items: { type: "string" },
            example: ["티셔츠", "상의"],
          },
          imageUrls: { type: "array", items: { type: "string" } },
        },
      },
      ArticleBody: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "중고 노트북 시세 질문" },
          content: {
            type: "string",
            example: "이 정도 사양이면 얼마에 팔면 좋을까요?",
          },
          imageUrls: { type: "array", items: { type: "string" } },
        },
      },
      CommentBody: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", example: "좋은 정보 감사합니다." },
        },
      },
    },
  },
  paths: {
    "/auth/signUp": {
      post: {
        tags: ["Auth"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthBody" },
            },
          },
        },
        responses: {
          201: { description: "회원가입 성공" },
          400: { description: "입력값 오류" },
          409: { description: "이미 가입된 이메일" },
        },
      },
    },
    "/auth/signIn": {
      post: {
        tags: ["Auth"],
        summary: "로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthBody" },
            },
          },
        },
        responses: {
          200: { description: "로그인 성공" },
          401: { description: "인증 실패" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "액세스 토큰 재발급",
        responses: {
          200: { description: "새 액세스 토큰 발급" },
          401: { description: "리프레시 토큰 오류" },
        },
      },
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "내 정보 조회",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "내 정보" },
          401: { description: "로그인 필요" },
        },
      },
    },
    "/uploads/images": {
      post: {
        tags: ["Uploads"],
        summary: "이미지 업로드",
        security: [{ bearerAuth: [] }],
        requsetBody: {
          requried: true,
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
        summary: "상품 목록 조회",
        parameters: [
          {
            name: "orderBy",
            in: "query",
            schema: { type: "string", enum: ["recent", "favorite"] },
          },
          { name: "keyword", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "number" } },
          { name: "limit", in: "query", schema: { type: "number" } },
        ],
        responses: { 200: { description: "상품 목록" } },
      },
      post: {
        tags: ["Products"],
        summary: "상품 등록",
        security: [{ bearerAuth: [] }],
        requsetBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductBody" },
            },
          },
        },
        responses: {
          201: { description: "상품 등록 성공" },
          400: { description: "입력값 오류" },
          401: { description: "로그인 필요" },
        },
      },
    },
    "/products/best": {
      get: {
        tags: ["Products"],
        summary: "베스트 상품 조회",
        responses: { 200: { description: "좋아요가 많은 상품 목록" } },
      },
    },
    "/products/{productId}": {
      get: {
        tags: ["Products"],
        summary: "상품 상세 조회",
        responses: {
          200: { description: "상품 상세 정보" },
          404: { description: "상품 없음" },
        },
      },
      patch: {
        tages: ["Products"],
        summary: "상품 수정",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "상품 수정 성공" },
          403: { description: "권한 없음" },
          404: { description: "상품 없음" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "상품 삭제",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "상품 삭제 성공" },
          403: { description: "권한 없음" },
          404: { description: "상품 없음" },
        },
      },
    },
    "/products/{productId}/favorite": {
      post: {
        tags: ["Products"],
        summary: "상품 좋아요",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "상품 좋아요 성공" } },
      },
      delete: {
        tags: ["Products"],
        summary: "상품 좋아요 취소",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "상품 좋아요 취소 성공" } },
      },
    },
    "/products/{productId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "상품 댓글 목록 조회",
        responses: { 200: { description: "상품 댓글 목록" } },
      },
      post: {
        tags: ["Comments"],
        summary: "상품 댓글 등록",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "상품 댓글 등록 성공" } },
      },
    },
    "/articles": {
      get: {
        tags: ["Articles"],
        summary: "게시글 목록 조회",
        responses: { 200: { description: "게시글 목록" } },
      },
      post: {
        tags: ["Articles"],
        summary: "게시글 등록",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ArticleBody" },
            },
          },
        },
        responses: { 201: { description: "게시글 등록 성공" } },
      },
    },
    "/articles/best": {
      get: {
        tags: ["Articles"],
        summary: "베스트 게시글 조회",
        responses: { 200: { description: "좋아요가 많은 게시글 목록" } },
      },
    },
    "/articles/{articleId}": {
      get: {
        tags: ["Articles"],
        summary: "게시글 상세 조회",
        responses: {
          200: { description: "게시글 상세 정보" },
          404: { description: "게시글 없음" },
        },
      },
      patch: {
        tags: ["Articles"],
        summary: "게시글 수정",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "게시글 수정 성공" } },
      },
      delete: {
        tags: ["Articles"],
        summary: "게시글 삭제",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "게시글 삭제 성공" } },
      },
    },
    "/articles/{articleId}/favorite": {
      post: {
        tags: ["Articles"],
        summary: "게시글 좋아요",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "게시글 좋아요 성공" } },
      },
      delete: {
        tags: ["Articles"],
        summary: "게시글 좋아요 취소",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "게시글 좋아요 취소 성공" } },
      },
    },
    "/articles/{articleId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "게시글 댓글 목록 조회",
        responses: { 200: { description: "게시글 댓글 목록" } },
      },
      post: {
        tags: ["Comments"],
        summary: "게시글 댓글 등록",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "게시글 댓글 등록 성공" } },
      },
    },
    "/comments/{commentId}": {
      patch: {
        tags: ["Comments"],
        summary: "댓글 수정",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentBody" },
            },
          },
        },
        responses: { 200: { description: "댓글 수정 성공" } },
      },
      delete: {
        tags: ["Comments"],
        summary: "댓글 삭제",
        securtiy: [{ bearerAuth: [] }],
        responses: { 200: { description: "댓글 삭제 성공" } },
      },
    },
  },
};
