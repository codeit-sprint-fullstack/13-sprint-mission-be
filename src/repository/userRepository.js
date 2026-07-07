import prisma from "#/lib/prisma.js";

const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.user.create({ data });
  },

  updateRefreshToken(id, refreshToken) {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  },
};

export default userRepository;
