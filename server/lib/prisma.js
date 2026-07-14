const { PrismaClient } = require("@prisma/client");

// PrismaClient 인스턴스를 하나만 생성
const prisma = new PrismaClient();

module.exports = prisma;
