import express from "express";
import passport from "#/config/passport.js";
import authController from "#/controllers/authController.js";

const userRouter = express.Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: 내 정보 조회
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: 인증 필요
 */
userRouter.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  authController.getMe,
);

export default userRouter;
