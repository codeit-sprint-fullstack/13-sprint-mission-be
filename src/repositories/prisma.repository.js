import "../utils/env.util.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function now() {
  return new Date();
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export { createId, now, prisma };
