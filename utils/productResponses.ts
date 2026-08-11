type WithWriter = {
  userId?: number;
  user?: { id: number; nickname: string };
} & Record<string, unknown>;
type WithOwner = {
  userId?: number;
  comments?: WithWriter[];
} & Record<string, unknown>;

export function serializeProductResponse<T extends WithOwner>(product: T) {
  const { userId, comments, ...rest } = product;
  return {
    ...rest,
    ...(comments === undefined ? {} : { comments: comments.map(serializeProductCommentResponse) }),
    ...(userId === undefined ? {} : { ownerId: userId }),
  };
}

export function serializeProductCommentResponse<T extends WithWriter>(comment: T) {
  const { userId: _userId, user, ...rest } = comment;
  return user ? { ...rest, writer: user } : rest;
}
