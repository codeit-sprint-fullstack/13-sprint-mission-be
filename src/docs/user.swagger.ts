// ============================================================
// Swagger (OpenAPI) 문서 - 유저
// ============================================================

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [User]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
