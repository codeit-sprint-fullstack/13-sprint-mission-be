// ============================================================
// User 컨트롤러
// ============================================================
import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";
import parseId from "../utils/parse.js";

async function getMe(req, res, next) {
  const user = await userService.getById(parseId(req.user.userId));

  return res.json({ success: true, data: user });
}

export default {
  getMe,
};
