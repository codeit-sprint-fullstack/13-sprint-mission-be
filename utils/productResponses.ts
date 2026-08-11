type WithOwner = { userId?: number } & Record<string, unknown>;
type WithWriter = {
  userId?: number;
  user?: { id: number; nickname: string };
} & Record<string, unknown>;

export function serializeProductResponse<T extends WithOwner>(product: T) {
  const { userId, ...rest } = product;
  return userId === undefined ? rest : { ...rest, ownerId: userId };
}

export function serializeProductCommentResponse<T extends WithWriter>(comment: T) {
  const { userId: _userId, user, ...rest } = comment;
  return user ? { ...rest, writer: user } : rest;
}
