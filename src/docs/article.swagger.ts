// ============================================================
// Swagger (OpenAPI) 문서 - 자유게시판 게시글/댓글
// ============================================================

/**
 * @openapi
 * /articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     description: 로그인 없이도 조회 가능. 로그인 시 각 게시글에 isLiked가 정확히 채워집니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: 제목/내용 검색어
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [recent, like], default: recent }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Article' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *   post:
 *     summary: 게시글 등록
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [images, title, content]
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: uri }
 *                 maxItems: 3
 *               title: { type: string, maxLength: 10 }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Article' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     summary: 게시글 단건 조회
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Article' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     summary: 게시글 수정
 *     description: 본인이 등록한 게시글만 수정 가능
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: uri }
 *               title: { type: string, maxLength: 10 }
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Article' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     summary: 게시글 삭제
 *     description: 본인이 등록한 게시글만 삭제 가능
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 게시글이 삭제되었습니다 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @openapi
 * /articles/{articleId}/likes:
 *   post:
 *     summary: 게시글 좋아요 토글 (추가/취소)
 *     description: 이미 좋아요를 눌렀으면 취소, 아니면 추가합니다. 로그인 필요.
 *     tags: [Article]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 토글 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked: { type: boolean }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @openapi
 * /articles/{articleId}/comments:
 *   get:
 *     summary: 게시글 댓글 목록 조회
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Comment' }
 *   post:
 *     summary: 게시글 댓글 등록
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Comment' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @openapi
 * /articles/{articleId}/comments/{commentId}:
 *   patch:
 *     summary: 게시글 댓글 수정
 *     description: 본인이 작성한 댓글만 수정 가능
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Comment' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     summary: 게시글 댓글 삭제
 *     description: 본인이 작성한 댓글만 삭제 가능
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 댓글이 삭제되었습니다 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
