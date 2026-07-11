function toPublicUser(user) {
  const { encryptedPassword, ...rest } = user;
  return rest;
}

export async function getMe(req, res) {
  res.status(200).json(toPublicUser(req.user));
}
