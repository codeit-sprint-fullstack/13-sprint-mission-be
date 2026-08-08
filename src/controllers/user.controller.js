import * as userService from "../services/user.service.js";

function me(req, res) {
  res.json(userService.me(req.user));
}

export { me };
