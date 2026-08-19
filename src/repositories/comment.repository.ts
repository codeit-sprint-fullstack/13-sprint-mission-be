import { prisma } from "./prisma.repository";
import type {
  CommentCreateData,
  CommentUpdateData,
  CommentWithOwner,
  TargetType,
} from "../types/domain";

const include = { owner: true } as const;

function findById(id: string): Promise<CommentWithOwner | null> {
  return prisma.comment.findUnique({ where: { id }, include });
}

function findByTarget(
  targetType: TargetType,
  targetId: string,
): Promise<CommentWithOwner[]> {
  return prisma.comment.findMany({
    where: { targetType, targetId },
    include,
    orderBy: { createdAt: "desc" },
  });
}

function create(data: CommentCreateData): Promise<CommentWithOwner> {
  return prisma.comment.create({ data, include });
}

function update(
  id: string,
  data: CommentUpdateData,
): Promise<CommentWithOwner> {
  return prisma.comment.update({ where: { id }, data, include });
}

function remove(id: string) {
  return prisma.comment.delete({ where: { id } });
}

export { create, findById, findByTarget, remove, update };
