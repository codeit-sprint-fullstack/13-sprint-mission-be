// ============================================================
// Swagger (OpenAPI) 문서 - 이미지
// ============================================================

/**
 * @openapi
 * /images/upload:
 *   post:
 *     summary: 이미지 업로드
 *     description: 업로드된 이미지는 서버 uploads/ 폴더에 저장되고, 접근 가능한 경로를 반환합니다.
 *     tags: [Image]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: jpeg/png/gif, 최대 10MB
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     path: { type: string, example: /download-images/uuid.jpg }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
