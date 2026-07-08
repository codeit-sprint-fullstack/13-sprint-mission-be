import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpecs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Panda Market API',
      version: '1.0.0',
      description: 'Sprint Mission Panda Market backend API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            nickname: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'integer' },
            tags: {
              type: 'array',
              items: { type: 'string' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            content: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OffsetList: {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: { type: 'object' },
            },
            totalCount: { type: 'integer' },
            offset: { type: 'integer' },
            limit: { type: 'integer' },
            hasNext: { type: 'boolean' },
          },
        },
      },
    },
    paths: {
      '/auth/signUp': {
        post: {
          tags: ['Auth'],
          summary: '회원가입',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'nickname', 'password', 'passwordConfirmation'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    nickname: { type: 'string' },
                    password: { type: 'string' },
                    passwordConfirmation: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            400: { description: 'Bad Request' },
            409: { description: 'Conflict' },
          },
        },
      },
      '/auth/signIn': {
        post: {
          tags: ['Auth'],
          summary: '로그인',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/products': {
        get: {
          tags: ['Product'],
          summary: '상품 목록 조회',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer' } },
            { in: 'query', name: 'offset', schema: { type: 'integer' } },
            { in: 'query', name: 'keyword', schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/OffsetList' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Product'],
          summary: '상품 등록',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'description', 'price'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'integer' },
                    tags: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Created' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/products/best': {
        get: {
          tags: ['Product'],
          summary: '베스트 상품 목록 조회',
          responses: { 200: { description: 'OK' } },
        },
      },
      '/products/{productId}/like': {
        post: {
          tags: ['Product'],
          summary: '상품 좋아요',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Product'],
          summary: '상품 좋아요 취소',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
          },
        },
      },
      '/products/{id}': {
        get: {
          tags: ['Product'],
          summary: '상품 상세 조회',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            404: { description: 'Not Found' },
          },
        },
        patch: {
          tags: ['Product'],
          summary: '상품 수정',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Product'],
          summary: '상품 삭제',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'No Content' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Not Found' },
          },
        },
      },
      '/products/{productId}/comments': {
        get: {
          tags: ['Product Comment'],
          summary: '상품 댓글 목록 조회',
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Product Comment'],
          summary: '상품 댓글 등록',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'integer' } }],
          responses: {
            201: { description: 'Created' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/products/{productId}/comments/{commentId}': {
        patch: {
          tags: ['Product Comment'],
          summary: '상품 댓글 수정',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'productId', required: true, schema: { type: 'integer' } },
            { in: 'path', name: 'commentId', required: true, schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          tags: ['Product Comment'],
          summary: '상품 댓글 삭제',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'productId', required: true, schema: { type: 'integer' } },
            { in: 'path', name: 'commentId', required: true, schema: { type: 'integer' } },
          ],
          responses: { 204: { description: 'No Content' } },
        },
      },
      '/articles': {
        get: {
          tags: ['Article'],
          summary: '게시글 목록 조회',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'keyword', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Article'],
          summary: '게시글 등록',
          responses: { 201: { description: 'Created' } },
        },
      },
      '/articles/{articleId}/like': {
        post: {
          tags: ['Article'],
          summary: '게시글 좋아요',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
          },
        },
        delete: {
          tags: ['Article'],
          summary: '게시글 좋아요 취소',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not Found' },
          },
        },
      },
      '/articles/{id}': {
        get: {
          tags: ['Article'],
          summary: '게시글 상세 조회',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'OK' },
            404: { description: 'Not Found' },
          },
        },
        patch: {
          tags: ['Article'],
          summary: '게시글 수정',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          tags: ['Article'],
          summary: '게시글 삭제',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'No Content' } },
        },
      },
      '/articles/{articleId}/comments': {
        get: {
          tags: ['Article Comment'],
          summary: '게시글 댓글 목록 조회',
          parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          tags: ['Article Comment'],
          summary: '게시글 댓글 등록',
          parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } }],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/articles/{articleId}/comments/{commentId}': {
        patch: {
          tags: ['Article Comment'],
          summary: '게시글 댓글 수정',
          parameters: [
            { in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } },
            { in: 'path', name: 'commentId', required: true, schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        delete: {
          tags: ['Article Comment'],
          summary: '게시글 댓글 삭제',
          parameters: [
            { in: 'path', name: 'articleId', required: true, schema: { type: 'integer' } },
            { in: 'path', name: 'commentId', required: true, schema: { type: 'integer' } },
          ],
          responses: { 204: { description: 'No Content' } },
        },
      },
      '/images/upload': {
        post: {
          tags: ['Image'],
          summary: '이미지 업로드',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['image'],
                  properties: {
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Created' },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
});

export default swaggerSpecs;
