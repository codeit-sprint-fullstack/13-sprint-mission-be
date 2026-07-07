import userService from "../services/userService.js";

const getUserDetail = async (req, res) => {
  const { id: userId } = req.auth;
  const user = await userService.getUserDetail(userId);
  res.status(200).json(user);
};

export default { getUserDetail };
